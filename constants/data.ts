import { Contact } from "./types";

interface Destination {
  imageURL: string;
  path: string;
  duration: number;
  unit: "days" | "hours" | "hour";
  person: number;
  title: string;
  desc: string;
  price: number;
}

export const popularTourData: Destination[] = [
  {
    imageURL: "/images/raftings.jpg",
    path: "/",
    duration: 5,
    unit: "hours",
    person: 2,
    title: "The Ayung River",
    desc: "Embark on an exhilarating adventure down the Ayung River, Bali’s premier rafting destination! Paddle through breathtaking tropical landscapes, glide past hidden waterfalls, and feel the thrill of the rapids. Whether you’re an adrenaline seeker or looking for a fun-filled day with family, rafting in the Ayung River promises an unforgettable experience. Get ready to explore Bali from a whole new perspective!",
    price: 200000,
  },
  {
    imageURL: "/images/waterfall.jpg",
    path: "/",
    duration: 3,
    unit: "hours",
    person: 2,
    title: "Sekumpul Waterfall",
    desc: "Discover the natural beauty of Bali at Sekumpul Waterfall, a hidden gem nestled in lush greenery. Trek through scenic trails and be rewarded by the sight of majestic cascading waters, often considered the most beautiful waterfall on the island. Whether you're a nature lover or an adventure enthusiast, the tranquil surroundings and awe-inspiring views of Sekumpul promise a serene and unforgettable escape into the heart of Bali.",
    price: 150000,
  },
  {
    imageURL: "/images/monkey.jpg",
    path: "/",
    duration: 4,
    unit: "hours",
    person: 5,
    title: "Monkey Forest",
    desc: "Step into the enchanting Monkey Forest in Ubud, where nature and culture come together in perfect harmony. Wander through the lush sanctuary, home to hundreds of playful long-tailed macaques, and explore ancient temples nestled within the jungle. Whether you're an animal lover or a cultural explorer, Monkey Forest offers a unique experience that captures the essence of Bali's natural beauty and spiritual heritage.",
    price: 150000,
  },
  {
    imageURL: "/images/atv.jpg",
    path: "/",
    duration: 5,
    unit: "hours",
    person: 4,
    title: "ATV Adventure",
    desc: "Rev up your excitement with an adrenaline-pumping ATV adventure through Bali’s rugged terrains! Explore hidden trails, ride through lush jungles, and conquer challenging off-road tracks that take you through rivers, rice fields, and local villages. Whether you're a thrill-seeker or just looking for a fun way to explore Bali’s countryside, an ATV adventure guarantees an unforgettable ride packed with excitement and stunning views.",
    price: 250000,
  },
];

export const bookingSteps: string[] = [
  "pending",
  "confirmed",
  "paid",
  "ongoing",
  "complete",
];

export const contact: Contact = {
  address: "Br. Ayah, Kelusa, Kec. Payangan, Gianyar, Bali, 80572",
  email: "mailto:karenstourtravel@gmail.com",
  phone: "+6281246768627",
  whatsapp: "https://api.whatsapp.com/send?phone=+6281246768627",
  instagram: "https://www.instagram.com/karenstourtravel",
  copyright: "© 2025 Karen's Tour Bali. All Rights Reserved.",
  company: "Karen's Tour",
};
