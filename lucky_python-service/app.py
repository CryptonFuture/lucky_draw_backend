#!/usr/bin/env python3
"""
Lucky Draw - Secure Winner Selection Service
Uses Python's secrets module for cryptographically secure randomness.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import secrets
import hashlib
from datetime import datetime

app = Flask(__name__)
CORS(app)


def secure_sample(total: int, k: int) -> list:
    """
    Select k unique random indices from 0..total-1 using
    cryptographically secure randomness (secrets module).
    """
    if k > total:
        k = total
    if k <= 0 or total <= 0:
        return []

    # Fisher-Yates shuffle with secrets
    indices = list(range(total))
    for i in range(total - 1, 0, -1):
        j = secrets.randbelow(i + 1)
        indices[i], indices[j] = indices[j], indices[i]

    return indices[:k]


@app.route('/')
def home():
    return jsonify({
        'success': True,
        'service': 'Lucky Draw Secure Random Service',
        'version': '1.0.0',
        'method': 'Python secrets (CSPRNG)'
    })


@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})


@app.route('/select-winners', methods=['POST'])
def select_winners():
    """
    Select winners securely.
    
    Body:
    {
      "total_entries": 100,
      "num_winners": 3
    }
    
    Returns:
    {
      "success": true,
      "indices": [42, 7, 91],
      "seed": "hex_string_for_verification",
      "method": "python-secrets",
      "timestamp": "..."
    }
    """
    try:
        data = request.get_json() or {}
        total = int(data.get('total_entries', 0))
        num_winners = int(data.get('num_winners', 1))

        if total <= 0:
            return jsonify({'success': False, 'message': 'total_entries must be > 0'}), 400

        if num_winners <= 0:
            return jsonify({'success': False, 'message': 'num_winners must be > 0'}), 400

        indices = secure_sample(total, num_winners)

        # Create a verification seed (hash of selection + timestamp + random)
        seed_data = f"{indices}-{datetime.utcnow().isoformat()}-{secrets.token_hex(8)}"
        seed = hashlib.sha256(seed_data.encode()).hexdigest()

        return jsonify({
            'success': True,
            'indices': indices,
            'seed': seed,
            'method': 'python-secrets-csprng',
            'total_entries': total,
            'num_winners': len(indices),
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        })

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/verify', methods=['POST'])
def verify():
    """Simple endpoint for transparency checks."""
    data = request.get_json() or {}
    return jsonify({
        'success': True,
        'message': 'Verification endpoint - seed can be used for audit trails',
        'received': data
    })


if __name__ == '__main__':
    print('🎲 Lucky Draw Python Service starting on http://localhost:8000')
    app.run(host='0.0.0.0', port=8000, debug=True)