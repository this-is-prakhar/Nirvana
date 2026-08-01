import os
import pandas as pd
from utils import save_as_js, ensure_data_dir, log

def validate_schema(df, expected_columns):
    actual_columns = set(df.columns)
    expected_set = set(expected_columns)
    
    missing = expected_set - actual_columns
    extra = actual_columns - expected_set
    
    if missing:
        log(f"Warning: Missing columns: {missing}")
    if extra:
        log(f"Info: Extra columns found: {extra}")
        
    return df

def clean_dataframe(df):
    # Handle NaN values
    df = df.fillna('')
    # Convert dataframe to list of dicts
    records = df.to_dict('records')
    # Clean up empty strings or convert types as needed
    cleaned_records = []
    for record in records:
        cleaned_record = {}
        for k, v in record.items():
            if isinstance(v, pd.Timestamp):
                cleaned_record[k] = v.isoformat()
            elif pd.isna(v):
                cleaned_record[k] = None
            else:
                cleaned_record[k] = v
        cleaned_records.append(cleaned_record)
    return cleaned_records

def import_excel(filepath, data_type, expected_columns=None):
    log(f"Importing Excel file {filepath} for {data_type}")
    try:
        df = pd.read_excel(filepath)
        if expected_columns:
            df = validate_schema(df, expected_columns)
        
        data = clean_dataframe(df)
        out_path = os.path.join(ensure_data_dir(), f"{data_type}.js")
        
        # Determine JS variable name (e.g. 'mutual_funds' -> 'mutualFunds')
        var_parts = data_type.split('_')
        var_name = var_parts[0] + ''.join(x.title() for x in var_parts[1:])
        
        save_as_js(data, var_name, out_path)
        return len(data)
    except Exception as e:
        log(f"Error importing Excel: {e}")
        return 0

def import_csv(filepath, data_type, expected_columns=None):
    log(f"Importing CSV file {filepath} for {data_type}")
    try:
        df = pd.read_csv(filepath)
        if expected_columns:
            df = validate_schema(df, expected_columns)
            
        data = clean_dataframe(df)
        out_path = os.path.join(ensure_data_dir(), f"{data_type}.js")
        
        var_parts = data_type.split('_')
        var_name = var_parts[0] + ''.join(x.title() for x in var_parts[1:])
        
        save_as_js(data, var_name, out_path)
        return len(data)
    except Exception as e:
        log(f"Error importing CSV: {e}")
        return 0

def generate_templates():
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    os.makedirs(templates_dir, exist_ok=True)
    
    schemas = {
        "stocks": ["symbol", "name", "price", "change", "marketCap", "sector"],
        "mutual_funds": ["id", "name", "category", "nav", "1Y_Return", "3Y_Return", "expenseRatio", "aum", "risk"],
        "credit_cards": ["id", "name", "bank", "joiningFee", "annualFee", "annualFeeWaiver", "bestFor", "features", "rating"]
    }
    
    for name, cols in schemas.items():
        df = pd.DataFrame(columns=cols)
        path = os.path.join(templates_dir, f"{name}_template.xlsx")
        df.to_excel(path, index=False)
        log(f"Generated template: {path}")

if __name__ == "__main__":
    generate_templates()
