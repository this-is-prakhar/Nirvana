import argparse
import time
from utils import log
import investing_scraper
import paisabazaar_scraper

def run(stocks_only=False, cards_only=False, all_scrapers=True):
    start_time = time.time()
    total_records = 0
    errors = 0
    
    log("="*50)
    log("Starting Nirvana Data Update Run")
    log("="*50)
    
    if stocks_only or all_scrapers:
        try:
            counts = investing_scraper.run_all()
            total_records += sum(counts.values())
        except Exception as e:
            log(f"Error running investing scraper: {e}")
            errors += 1
            
    if cards_only or all_scrapers:
        try:
            counts = paisabazaar_scraper.run_all()
            total_records += sum(counts.values())
        except Exception as e:
            log(f"Error running paisabazaar scraper: {e}")
            errors += 1

    elapsed = time.time() - start_time
    
    log("="*50)
    log(f"Run Summary:")
    log(f"Total time: {elapsed:.2f} seconds")
    log(f"Total records updated: {total_records}")
    log(f"Errors encountered: {errors}")
    log("="*50)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run Nirvana Data Scrapers')
    parser.add_argument('--stocks-only', action='store_true', help='Run only the investing scraper')
    parser.add_argument('--credit-cards-only', action='store_true', help='Run only the paisabazaar scraper')
    parser.add_argument('--all', action='store_true', help='Run all scrapers')
    
    args = parser.parse_args()
    
    if args.stocks_only or args.credit_cards_only:
        run(stocks_only=args.stocks_only, cards_only=args.credit_cards_only, all_scrapers=False)
    else:
        run(all_scrapers=True)
