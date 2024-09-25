import random

# Define titles, descriptions, and inclusions
titles = [
    "Bali Beach Retreat",
    "Uluwatu Cliff View",
    "Jungle Adventure",
    "Cultural Tour of Ubud",
    "Sunset Dinner Cruise",
    "Mount Batur Sunrise Trek",
    "Snorkeling in Nusa Penida",
    "Balinese Cooking Class",
    "Waterfall Exploration",
    "Temple Tour",
    "Hidden Lagoon Adventure",
    "Luxury Spa Day",
    "Bali Village Homestay",
    "Rice Terrace Trekking",
    "Sacred Monkey Forest Experience",
    "Traditional Balinese Dance Show",
    "Island Hopping Tour",
    "Beachfront Yoga Session",
    "Scuba Diving in Tulamben",
    "Cycling through Tegallalang",
    "Eco-friendly Safari",
    "Private Villa Retreat",
    "Artisan Handicraft Tour",
    "Helicopter Tour Over Bali",
    "Hot Spring Relaxation",
    "Whale Watching Excursion",
    "Volcano Biking Tour",
    "Luxury Catamaran Cruise",
    "Surfing Lessons in Canggu",
    "Balinese Healing Ceremony",
    "Meditation Retreat in the Jungle",
    "Coffee Plantation Visit",
    "White Water Rafting",
    "Mangrove Forest Kayaking",
    "Night Safari Adventure",
    "Sunset Horseback Riding",
    "Kite Surfing in Sanur",
    "Water Sports at Tanjung Benoa",
    "Mangrove Eco Tour",
    "Photography Tour in Bali",
    "Luxury Stay in Seminyak",
    "Balinese Jewelry Making Workshop",
    "Culinary Tour in Kuta",
    "Historical Temple Walk",
]

descriptions = [
    "Embark on an unforgettable journey through the cultural and natural wonders of Bali. From the majestic Uluwatu Cliff View, where the dramatic coastline meets the vast ocean, to the serene beaches of Gili Islands with their tranquil atmosphere and absence of motorized vehicles, this adventure promises an enriching experience. Dive into the crystal-clear waters of Nusa Penida for a snorkeling escapade that unveils vibrant marine life, and indulge in a sunset dinner cruise that offers picturesque views and gourmet dining. As the day ends, enjoy the calming rhythm of Bali’s gentle waves and let the island’s beauty captivate your senses.",
    "Step into the heart of Bali with our immersive Cultural Tour of Ubud. Begin your exploration with a visit to the traditional markets where local artisans display their craftsmanship. Wander through ancient temples that tell the stories of Bali’s rich heritage and delve into the island’s spiritual essence. The journey continues with a trek through lush rice terraces, where you can marvel at the ingenuity of traditional irrigation systems. Experience the island’s culinary delights with a hands-on cooking class, and end the day with a serene sunset view over the iconic landscapes of Ubud.",
    "Join us for an exhilarating Island Hopping Tour that takes you beyond Bali to the enchanting Gili Islands. This tour includes stops at the idyllic islands of Gili Trawangan, Gili Meno, and Gili Air, each offering its unique charm and pristine beauty. Experience the thrill of swimming with majestic whale sharks off the coast of Sumbawa, and explore the hidden waterfalls of Moyo Island. Each destination is a gem waiting to be discovered, offering a blend of relaxation, adventure, and unparalleled natural beauty. Your journey concludes with a visit to uninhabited islands, where untouched landscapes and tranquil waters provide the perfect end to an extraordinary adventure.",
    "Immerse yourself in the ultimate luxury experience with our Private Villa Retreat. Nestled in the serene surroundings of Seminyak, this retreat offers an exclusive escape from the everyday hustle. Enjoy the privacy of your own villa, complete with a private pool, lush gardens, and personalized service. Indulge in rejuvenating spa treatments that blend traditional Balinese techniques with modern wellness practices. Explore the vibrant local culture with a guided tour of nearby artisan workshops and historical sites. Each day presents a new opportunity for relaxation, adventure, and cultural enrichment, making this retreat a truly unforgettable experience.",
    "Discover the hidden treasures of Bali with our comprehensive tour that spans the island’s most captivating destinations. Start with a visit to the Sacred Monkey Forest, where playful monkeys interact with visitors amidst ancient temple ruins. Continue to the picturesque rice terraces of Tegallalang, where the lush green fields create a stunning backdrop for exploration. Unwind with a luxurious stay in a beachfront villa, and experience the island’s vibrant nightlife with a private beach party. From cultural insights to natural wonders, this tour offers a perfect balance of relaxation and adventure, ensuring a memorable Bali experience.",
]

video_urls = [
    "BFS9n4B_2xA",
    "zHcr32gRRCs",
    "VoWepqBuw3Y",
    "wCI_8uOYdlQ",
    "",
    "",
]

inclusion_options = [
    "Complimentary breakfast",
    "Free airport transfer",
    "Guided tour included",
    "Free Wi-Fi",
    "Access to private beach",
    "Spa voucher",
    "Welcome drink",
    "Dinner included",
    "Late check-out",
]

existing_slugs = set()


def clean_text(text):
    return text.replace("'", "").replace(",", "").replace("!", "")


def generate_unique_slug(title):
    slug = (
        title.lower()
        .replace(" ", "-")
        .replace("'", "")
        .replace(",", "")
        .replace("!", "")
    )
    original_slug = slug
    count = 1
    while slug in existing_slugs:
        slug = f"{original_slug}-{count}"
        count += 1
    existing_slugs.add(slug)
    return slug


def generate_inclusions():
    # Generate a random number of inclusions (3 to 6)
    num_inclusions = random.randint(3, 6)
    # Randomly select inclusions from the options
    selected_inclusions = random.sample(inclusion_options, num_inclusions)
    return (
        "{"
        + ", ".join(f'"{clean_text(inclusion)}"' for inclusion in selected_inclusions)
        + "}"
    )


def generate_row(index):
    title = titles[index % len(titles)]
    slug = generate_unique_slug(title)

    description = clean_text(descriptions[index % len(descriptions)])

    video_url = video_urls[random.randint(0, len(video_urls) - 1)]
    duration = random.randint(1, 5)
    unit = "day" if random.random() < 0.5 else "hour"
    duration_hour = duration * 24 if unit == "day" else duration
    service = random.randint(1, 2)

    # Generate a random price in thousands
    price_thousands = random.randint(100, 1000)  # Adjust the range as needed
    price = price_thousands * 10000

    num_images = random.randint(10, 15)
    images = [
        f"https://picsum.photos/{301 + index + (i * 100)}" for i in range(num_images)
    ]
    images_str = "{" + ", ".join(f'"{img}"' for img in images) + "}"

    inclusions_str = generate_inclusions()

    return f"( '{images_str}', '{title}', '{slug}', '{description}', {duration}, '{unit}', {duration_hour}, {service}, {price}, '{video_url}', '{inclusions_str}' )"


def generate_sql():
    sql = "INSERT INTO destination (images, title, slug, description, duration, unit, duration_hour, service, price, video_url, inclusions) VALUES\n"
    rows = [generate_row(i) for i in range(500)]
    sql += ",\n".join(rows) + ";"
    return sql


# Generate SQL statements and save to file
sql_statements = generate_sql()

with open("insert_destinations.txt", "w") as file:
    file.write(sql_statements)

print("SQL statements have been saved to insert_destinations.txt")
