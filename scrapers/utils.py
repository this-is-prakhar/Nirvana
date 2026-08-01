import os
import time
import json
import random
import logging
from datetime import datetime
import requests

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def log(message):
    logging.info(message)

def get_user_agent():
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
    ]
    return random.choice(user_agents)

def safe_request(url, headers=None, retries=3, delay=2):
    if headers is None:
        headers = {
            'User-Agent': get_user_agent(),
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }
    
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            log(f"Request failed for {url}: {e}. Attempt {attempt + 1}/{retries}")
            if attempt < retries - 1:
                time.sleep(delay * (2 ** attempt)) # Exponential backoff
    return None

def parse_number(text):
    if not isinstance(text, str):
        return text
    text = text.replace(',', '').replace('%', '').replace('₹', '').replace(' ', '')
    multiplier = 1
    if text.endswith('Cr'):
        multiplier = 10000000
        text = text[:-2]
    elif text.endswith('L'):
        multiplier = 100000
        text = text[:-1]
    elif text.endswith('M'):
        multiplier = 1000000
        text = text[:-1]
    elif text.endswith('B'):
        multiplier = 1000000000
        text = text[:-1]
    elif text.endswith('K'):
        multiplier = 1000
        text = text[:-1]
        
    try:
        return float(text) * multiplier
    except ValueError:
        return 0.0

def ensure_data_dir():
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    os.makedirs(data_dir, exist_ok=True)
    return data_dir

def save_as_js(data, variable_name, filepath):
    ensure_data_dir()
    
    # Add lastUpdated to data if it's a dict or list of dicts
    timestamp = datetime.now().isoformat()
    if isinstance(data, dict):
        data['lastUpdated'] = timestamp
    elif isinstance(data, list) and all(isinstance(x, dict) for x in data):
        for item in data:
            item['lastUpdated'] = timestamp
            
    json_data = json.dumps(data, indent=2)
    js_content = f"""(function() {{
    'use strict';
    window.NirvanaData = window.NirvanaData || {{}};
    window.NirvanaData.{variable_name} = {json_data};
}})();"""

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(js_content)
    log(f"Saved {variable_name} to {filepath}")
