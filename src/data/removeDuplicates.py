import json
from typing import List, Dict, Any

def remove_duplicates_from_json(input_file: str, output_file: str = None) -> None:
    """
    Remove duplicate entries from JSON content based on 'id' field.
    
    Args:
        input_file (str): Path to input JSON file
        output_file (str): Path to output JSON file (optional, defaults to input_file)
    """
    try:
        # Read the JSON file
        with open(input_file, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Extract content array
        content = data.get('content', [])
        
        # Remove duplicates based on 'id'
        unique_content = []
        seen_ids = set()
        
        for item in content:
            item_id = item.get('id')
            if item_id and item_id not in seen_ids:
                unique_content.append(item)
                seen_ids.add(item_id)
        
        # Create new data structure
        cleaned_data = {"content": unique_content}
        
        # Determine output file
        if output_file is None:
            output_file = input_file
        
        # Save cleaned data back to JSON
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(cleaned_data, file, indent=2, ensure_ascii=False)
        
        print(f"✅ Duplicates removed successfully!")
        print(f"📊 Original count: {len(content)}")
        print(f"📊 Unique count: {len(unique_content)}")
        print(f"📊 Duplicates removed: {len(content) - len(unique_content)}")
        print(f"💾 Saved to: {output_file}")
        
    except FileNotFoundError:
        print(f"❌ Error: File '{input_file}' not found.")
    except json.JSONDecodeError:
        print(f"❌ Error: Invalid JSON format in '{input_file}'.")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def create_sample_data() -> None:
    """Create a sample JSON file with duplicates for testing."""
    sample_data = {
        "content": [
            {
                "id": "tmdb_movie_1315988",
                "title": "Mikaela",
                "overview": "During the eve of the 6th of January, a record-breaking snowstorm sweeps across Spain...",
                "rating": 6.2,
                "vote_count": 44,
                "popularity": 408.6,
                "release_date": "2025-01-31",
                "runtime": 90,
                "genres": ["action", "thriller"],
                "original_language": "es",
                "production_countries": ["ES"],
                "budget": 0,
                "revenue": 0,
                "poster_url": "https://image.tmdb.org/t/p/w500/xG8olkWOmoW78GbozKbS2UxYGEo.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/w1280/8SaEH4kYCy7JlviyhKtSVsMkt4r.jpg",
                "thumbnail_url": "https://image.tmdb.org/t/p/w300/xG8olkWOmoW78GbozKbS2UxYGEo.jpg",
                "type": "movie",
                "mood_tags": ["thrilling", "edge-of-seat", "suspenseful"],
                "platform": "hotstar"
            },
            {
                "id": "tmdb_movie_574475",
                "title": "Final Destination Bloodlines",
                "overview": "Plagued by a violent recurring nightmare...",
                "rating": 7.0,
                "vote_count": 638,
                "popularity": 220.7,
                "release_date": "2025-05-14",
                "runtime": 110,
                "genres": ["horror", "mystery"],
                "original_language": "en",
                "production_countries": ["US"],
                "budget": 50000000,
                "revenue": 260647710,
                "poster_url": "https://image.tmdb.org/t/p/w500/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/w1280/uIpJPDNFoeX0TVml9smPrs9KUVx.jpg",
                "thumbnail_url": "https://image.tmdb.org/t/p/w300/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg",
                "type": "movie",
                "mood_tags": ["intriguing", "scary", "mysterious"],
                "platform": "hotstar"
            },
            # Duplicate entry
            {
                "id": "tmdb_movie_574475",
                "title": "Final Destination Bloodlines",
                "overview": "Plagued by a violent recurring nightmare...",
                "rating": 7.0,
                "vote_count": 638,
                "popularity": 220.7,
                "release_date": "2025-05-14",
                "runtime": 110,
                "genres": ["horror", "mystery"],
                "original_language": "en",
                "production_countries": ["US"],
                "budget": 50000000,
                "revenue": 260647710,
                "poster_url": "https://image.tmdb.org/t/p/w500/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/w1280/uIpJPDNFoeX0TVml9smPrs9KUVx.jpg",
                "thumbnail_url": "https://image.tmdb.org/t/p/w300/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg",
                "type": "movie",
                "mood_tags": ["intriguing", "scary", "mysterious"],
                "platform": "hotstar"
            }
        ]
    }
    
    with open('netflix_content.json', 'w', encoding='utf-8') as file:
        json.dump(sample_data, file, indent=2, ensure_ascii=False)
    
    print("📝 Sample data with duplicates created: netflix_content.json")

def main():
    """Main function to demonstrate the duplicate removal."""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python remove_duplicates.py <input_file> [output_file]")
        print("Or run without arguments to create sample data and test")
        
        # Create sample data for demonstration
        create_sample_data()
        
        # Remove duplicates from sample data
        remove_duplicates_from_json('netflix_content.json', 'netflix_content_clean.json')
    else:
        input_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else None
        remove_duplicates_from_json(input_file, output_file)

if __name__ == "__main__":
    main()
