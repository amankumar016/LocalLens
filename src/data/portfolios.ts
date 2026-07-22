export interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  description: string;
  aiPromptUsed: string;
  authenticityGrade: "A+" | "A" | "Verified Craft";
}

export const ARTISAN_PORTFOLIOS: Record<string, PortfolioItem[]> = {
  "ent-varanasi-1": [
    {
      id: "varanasi-1-item-1",
      title: "Ganga Twilight Rowing",
      image: "https://images.unsplash.com/photo-1561244243-73a44c69d565?auto=format&fit=crop&q=80&w=500",
      description: "Hand-carved wooden oars slicing through the sacred Ganges under an ambient purple twilight sky.",
      aiPromptUsed: "Ancient wooden rowboat on the river Ganges at dusk, glowing temple torches in background, photorealistic 8k",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "varanasi-1-item-2",
      title: "Painted Boat Bow",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=500",
      description: "Intricate traditional lotus patterns painted with natural oils on the wooden bow of a heritage boat.",
      aiPromptUsed: "Macro shot of hand-painted decorative traditional patterns on old wooden boat hull, rustic textures, vibrant paint",
      authenticityGrade: "A"
    },
    {
      id: "varanasi-1-item-3",
      title: "Dawn Aarti Spectacle",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=500",
      description: "A misty dawn boat charter positioned perfectly to view the historic Ganga Aarti.",
      aiPromptUsed: "Misty sunrise over ancient Varanasi ghats, spiritual river ritual with floating oil lamps, soft cinematic haze",
      authenticityGrade: "Verified Craft"
    }
  ],
  "ent-varanasi-2": [
    {
      id: "varanasi-2-item-1",
      title: "Royal Gold Brocade",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=500",
      description: "A gorgeous gold-embroidered silk brocade fabric utilizing traditional Mughal-inspired patterns.",
      aiPromptUsed: "Close up of royal banarasi silk saree fabric with gold zari brocade, intricate botanical pattern weaving, luxury textile",
      authenticityGrade: "A+"
    },
    {
      id: "varanasi-2-item-2",
      title: "Handloom Weft & Warp",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=500",
      description: "A dense assembly of vibrant dyed silk threads mounted on a traditional hand-shuttle loom.",
      aiPromptUsed: "Vibrant silk threads on a traditional wooden handloom, close-up details of weave patterns, high resolution",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "varanasi-2-item-3",
      title: "Kashi Crimson Weave",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=500",
      description: "A crimson raw silk drape featuring heavy silver buttis, perfect for holy bridal wear.",
      aiPromptUsed: "Crimson red silk fabric with handcrafted silver patterns, fine brocade weave detail, rich textures",
      authenticityGrade: "A+"
    }
  ],
  "ent-varanasi-3": [
    {
      id: "varanasi-3-item-1",
      title: "Vibrant Rickshaw Canopy",
      image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&q=80&w=500",
      description: "An eco-friendly canvas canopy decorated with hand-painted local flora and holy Ganges motifs.",
      aiPromptUsed: "Decorated rickshaw cloth roof cover with folk murals, vibrant orange and teal paint, indian street art",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "varanasi-3-item-2",
      title: "Custom Brass Gong Bell",
      image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=500",
      description: "A hand-polished brass chime bell mounted to alert walking pilgrims in the narrow alleys.",
      aiPromptUsed: "Traditional engraved indian brass bell mounted on vintage vehicle handlebar, bright sunlight, detailed engraving",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "varanasi-3-item-3",
      title: "Hand-woven Seat Covers",
      image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=500",
      description: "Upholstery covers spun from local cotton, providing lightweight and breathable seating.",
      aiPromptUsed: "Ethnic patterned cotton textile cushion, rustic weave, earthy organic colors, close-up interior shot",
      authenticityGrade: "A"
    }
  ],
  "ent-varanasi-4": [
    {
      id: "varanasi-4-item-1",
      title: "Lacquered Wooden Birds",
      image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=500",
      description: "Miniature sliding wooden birds coated with high-gloss natural tree-sap lacquer.",
      aiPromptUsed: "Traditional Indian wooden lacquered toys, hand-carved toy birds, bright yellow and red varnish, bokeh background",
      authenticityGrade: "A+"
    },
    {
      id: "varanasi-4-item-2",
      title: "Royal Clay Elephant",
      image: "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=500",
      description: "A clay and wood model elephant decorated in festive Gangetic ceremonial livery.",
      aiPromptUsed: "Colorful handmade clay and wooden elephant toy, intricately decorated with patterns, authentic rustic toy",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "varanasi-4-item-3",
      title: "Kinetic Folk Whistle",
      image: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&q=80&w=500",
      description: "A small acoustic toy whistle carved with clean spiral grooves and food-safe vegetable dyes.",
      aiPromptUsed: "Close up of traditional carved wooden whistle toy, warm organic varnished finish, minimalist handcraft",
      authenticityGrade: "Verified Craft"
    }
  ],
  "ent-jaipur-1": [
    {
      id: "jaipur-1-item-1",
      title: "Blue Pottery Vase",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=500",
      description: "A signature cobalt glazed pottery vessel depicting classic Rajasthani blue-birds.",
      aiPromptUsed: "Exquisite blue and white glazed ceramic pottery, traditional Indian cobalt glazed floral vase, pristine white background",
      authenticityGrade: "A+"
    },
    {
      id: "jaipur-1-item-2",
      title: "Glazed Indigo Charger",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=500",
      description: "A low-rim glazed serving dish painted with circular geometric mandala borders.",
      aiPromptUsed: "Indian ceramic plate with hand-painted indigo patterns, glossy glaze, traditional block style motifs",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "jaipur-1-item-3",
      title: "Sanganer Block Print",
      image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=500",
      description: "A fine cotton bedspread displaying symmetric gold-stenciled block patterns.",
      aiPromptUsed: "Jaipur hand block printed cotton sheet, traditional red and indigo floral stamp pattern, high-contrast flat lay",
      authenticityGrade: "A"
    }
  ],
  "ent-jaipur-2": [
    {
      id: "jaipur-2-item-1",
      title: "Kathputli Gilded Puppet",
      image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=500",
      description: "A traditional wooden puppet featuring large hand-painted almond eyes and a royal mustache.",
      aiPromptUsed: "Rajasthani kathputli string puppet, wooden face with traditional hand-painted features, shimmering sequin turban",
      authenticityGrade: "A+"
    },
    {
      id: "jaipur-2-item-2",
      title: "Sequined Rajput Costumes",
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=500",
      description: "Richly detailed miniature fabrics sewn with real gota-patti and glass micro-beads.",
      aiPromptUsed: "Authentic glittering Rajasthani textile details, rich gold zari, glass beads embroidery, high-fidelity texture",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "jaipur-2-item-3",
      title: "Papier-mâché Marionette",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=500",
      description: "A lightweight dancing marionette composed of cotton pulp, clay, and colorful glass eyes.",
      aiPromptUsed: "Eco-friendly hand-painted paper pulp doll puppet with colorful traditional garments, soft sunlight",
      authenticityGrade: "Verified Craft"
    }
  ],
  "ent-jaipur-3": [
    {
      id: "jaipur-3-item-1",
      title: "Hawa Mahal Sunset Tour",
      image: "https://images.unsplash.com/photo-1599661046289-e31887846eac?auto=format&fit=crop&q=80&w=500",
      description: "A scenic heritage e-carriage ride passing directly in front of the rose-tinted Palace of Winds.",
      aiPromptUsed: "Golden sunset over Hawa Mahal Palace in Jaipur, clean electric cart moving on the street, cinematic street view",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "jaipur-3-item-2",
      title: "Royal Pink Cart Frame",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500",
      description: "Cart chassis featuring double coat of traditional terracotta pink weather-safe finish.",
      aiPromptUsed: "Vibrant pink painted steel surface, traditional brass carvings, royal carriage accents, close-up details",
      authenticityGrade: "A"
    },
    {
      id: "jaipur-3-item-3",
      title: "Jaipur Block-print Liners",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=500",
      description: "Washable seat liners customized with Sanganer mango block print patterns.",
      aiPromptUsed: "Comfortable ethnic seat linen with blue and white botanical stamp prints, rustic luxury cart interior",
      authenticityGrade: "Verified Craft"
    }
  ],
  "ent-jaipur-4": [
    {
      id: "jaipur-4-item-1",
      title: "Amber Palace Lake Ferry",
      image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=500",
      description: "Maota Lake boat crossing, providing beautiful reflections of the colossal Amber Fort.",
      aiPromptUsed: "Majestic historic fort on mountain reflecting on lake water, serene old wooden ferry boat, dramatic skies",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "jaipur-4-item-2",
      title: "Peacock Royal Saddle",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500",
      description: "Carriage bench lined with velvet peacock crests and hand-stamped leather borders.",
      aiPromptUsed: "Luxury royal carriage seat leather, detailed hand-embossed peacock emblems, vintage leather textures",
      authenticityGrade: "A"
    },
    {
      id: "jaipur-4-item-3",
      title: "Gilded Carriage Harness",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=500",
      description: "Authentic hand-engraved brass studs and chains decorating the guide carriage rails.",
      aiPromptUsed: "Closeup of shiny engraved indian brass details, antique chariot harness, beautiful rustic textures",
      authenticityGrade: "Verified Craft"
    }
  ],
  "ent-kochi-1": [
    {
      id: "kochi-1-item-1",
      title: "Chinese Net Silhouette",
      image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=500",
      description: "An iconic teakwood cantilevered fishing net hoisted over Fort Kochi beach during high tide.",
      aiPromptUsed: "Golden sunset over Fort Kochi ocean, silhouette of giant wooden Chinese fishing nets, dramatic waves",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "kochi-1-item-2",
      title: "Backwater Canoe Cruise",
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=500",
      description: "A private backwater rowing experience on a traditional wood-planked canoe.",
      aiPromptUsed: "Lush tropical green backwaters of Kerala, narrow wooden canoe boat on reflective calm water, warm sunshine",
      authenticityGrade: "A"
    },
    {
      id: "kochi-1-item-3",
      title: "Hand-spun Mooring Rope",
      image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=500",
      description: "Extra thick marine-grade rope made from sun-cured organic coconut coir fibers.",
      aiPromptUsed: "Extreme macro of thick organic fiber rope, coconut coir texture, rustic sea port details",
      authenticityGrade: "Verified Craft"
    }
  ],
  "ent-kochi-2": [
    {
      id: "kochi-2-item-1",
      title: "Organic Coir Door Mat",
      image: "https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&q=80&w=500",
      description: "Coconut fiber mat printed with organic botanical stencils from local indigo and tea dyes.",
      aiPromptUsed: "Minimalist natural coco coir welcome mat, thick textured organic material, clean studio background",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "kochi-2-item-2",
      title: "Indigo Fiber Spools",
      image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=500",
      description: "Bright blue hand-spun jute and coir yarn spools drying in the coastal sun.",
      aiPromptUsed: "Spools of hand-spun yarn dyed with natural indigo, coastal spice weaver workshop, high details",
      authenticityGrade: "A"
    },
    {
      id: "kochi-2-item-3",
      title: "Banana Leaf Weave Basket",
      image: "https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=500",
      description: "Lightweight nesting storage baskets utilizing sun-dried banana leaf sheath ropes.",
      aiPromptUsed: "Set of three handcrafted woven storage baskets, natural organic texture, modern rustic interior",
      authenticityGrade: "A+"
    }
  ],
  "ent-kochi-3": [
    {
      id: "kochi-3-item-1",
      title: "Spice Trail Rickshaw",
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=500",
      description: "An eco-friendly green rickshaw running tours across historical spice warehouses.",
      aiPromptUsed: "Clean eco electric rickshaw parked on cozy historic street in Kochi, old Portuguese facades in background",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "kochi-3-item-2",
      title: "Dutch Quarter Lane Route",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=500",
      description: "Quiet cobblestone lanes of Mattancherry Dutch quarter included in the standard eco tour.",
      aiPromptUsed: "Cobblestone alleyway with pastel-colored historic colonial buildings, warm coastal lighting, beautiful street view",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "kochi-3-item-3",
      title: "Bamboo Spoke Steering",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=500",
      description: "A custom steering console wrapped in fine-grain steamed bamboo fibers.",
      aiPromptUsed: "Close up of vehicle steering grip wrapped in natural bamboo weave, organic textures, tropical craft feel",
      authenticityGrade: "A"
    }
  ],
  "ent-kochi-4": [
    {
      id: "kochi-4-item-1",
      title: "Crimson Kathakali Mask",
      image: "https://images.unsplash.com/photo-1611003182833-28318283320c?auto=format&fit=crop&q=80&w=500",
      description: "A hand-carved kumily wood mask depicting a majestic Kathakali stage persona.",
      aiPromptUsed: "Traditional colorful Kathakali face mask, hand carved wooden theatrical mask with ornate gold crown, dramatic lighting",
      authenticityGrade: "A+"
    },
    {
      id: "kochi-4-item-2",
      title: "Theyyam Clay Bust",
      image: "https://images.unsplash.com/photo-1588091124614-25e2cfbe7b41?auto=format&fit=crop&q=80&w=500",
      description: "An intense face model carved from clay and finished with vibrant orange dust pigment.",
      aiPromptUsed: "Traditional Theyyam performance wooden bust, bright red and yellow sacred pigments, rustic handcraft",
      authenticityGrade: "A"
    },
    {
      id: "kochi-4-item-3",
      title: "Rosewood Heritage Elephant",
      image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=500",
      description: "A solid rosewood elephant figurine detailed with a real brass bell and decorative cloth drape.",
      aiPromptUsed: "Polished dark wooden elephant sculpture, small detailed hand carving, warm teak tones, minimalist backdrop",
      authenticityGrade: "Verified Craft"
    }
  ],
  "ent-hampi-1": [
    {
      id: "hampi-1-item-1",
      title: "Bamboo Woven Coracle",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=500",
      description: "A circular boat constructed from interwoven splits of country bamboo and waterproofed tar coating.",
      aiPromptUsed: "Traditional circular coracle boat floating on calm river in India, massive scenic boulder cliffs in background, sunny day",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "hampi-1-item-2",
      title: "Boulder Sunset Crossing",
      image: "https://images.unsplash.com/photo-1600100397990-24b5e28a491a?auto=format&fit=crop&q=80&w=500",
      description: "Guided crossing in the river canyon surrounded by giant balance stones at sunset.",
      aiPromptUsed: "Mystic ruins of Hampi stone structures at sunset, calm river with scenic landscape reflections, 8k cinematic",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "hampi-1-item-3",
      title: "Handmade Teak Paddle",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=500",
      description: "Single-piece teakwood paddle carved with symbols of the historic Vijayanagara Empire.",
      aiPromptUsed: "Antique hand carved wooden paddle, elegant carvings on grip, rustic archaeological wooden craft",
      authenticityGrade: "A"
    }
  ],
  "ent-hampi-2": [
    {
      id: "hampi-2-item-1",
      title: "Banana Fiber Tote",
      image: "https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&q=80&w=500",
      description: "A modern organic handbag woven with durable banana stem fibers and vegetable tanned handles.",
      aiPromptUsed: "Stylish eco-friendly handbag made of banana fiber weave, natural straw bag texture, organic product photography",
      authenticityGrade: "A+"
    },
    {
      id: "hampi-2-item-2",
      title: "Eco Place Mats Set",
      image: "https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=500",
      description: "Textured tabletop mats crafted with contrasting rows of natural fiber and banana leaf ropes.",
      aiPromptUsed: "Set of earthy woven round table mats, minimalist kitchen setting, natural light, high-contrast textures",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "hampi-2-item-3",
      title: "Organic Straw Laundry basket",
      image: "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=500",
      description: "A heavy-duty tall storage hamper woven entirely from wild banana trunk ribbons.",
      aiPromptUsed: "Tall handmade woven laundry hamper, rustic organic dried grass textures, modern bright interior",
      authenticityGrade: "Verified Craft"
    }
  ],
  "ent-hampi-3": [
    {
      id: "hampi-3-item-1",
      title: "Open Air Bazaar Shuttle",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=500",
      description: "Solar-powered open passenger cart customized to traverse historical paths cleanly.",
      aiPromptUsed: "Modern minimalist open solar golf cart parked in a tropical scenic campus, bright clean daylight",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "hampi-3-item-2",
      title: "Stone Chariot Guided Stop",
      image: "https://images.unsplash.com/photo-1600100397608-f010e408fc69?auto=format&fit=crop&q=80&w=500",
      description: "Integrated tourist stop directly in front of Hampi's legendary Stone Chariot monument.",
      aiPromptUsed: "Historic stone temple chariot in Hampi, magnificent archaeological site in bright morning light, blue skies",
      authenticityGrade: "Verified Craft"
    },
    {
      id: "hampi-3-item-3",
      title: "Handmade Palm Sun Hat",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=500",
      description: "Lightweight sun protection hat woven from dried Hampi riverfront palmyra leaves.",
      aiPromptUsed: "Eco-friendly woven straw sun hat, tropical design, organic holiday accessory, clear background",
      authenticityGrade: "A"
    }
  ],
  "ent-hampi-4": [
    {
      id: "hampi-4-item-1",
      title: "Soapstone Ganesha Statue",
      image: "https://images.unsplash.com/photo-1608962714006-2ecd6b0e729b?auto=format&fit=crop&q=80&w=500",
      description: "A pocket-sized Lord Ganesha idol chiseled carefully out of local gray soapstone.",
      aiPromptUsed: "Detailed hand carved soapstone Hindu god Ganesha idol, pristine dark stone textures, rustic craftsmanship",
      authenticityGrade: "A+"
    },
    {
      id: "hampi-4-item-2",
      title: "Miniature Temple Pillar",
      image: "https://images.unsplash.com/photo-1571850125895-e2f49557b770?auto=format&fit=crop&q=80&w=500",
      description: "A granite desk-scale replica of Hampi's famous musical pillars with realistic chiseled bands.",
      aiPromptUsed: "Miniature chiseled stone pillar sculpture, highly detailed ancient architectural replica, gray granite finish",
      authenticityGrade: "A"
    },
    {
      id: "hampi-4-item-3",
      title: "Granite Nandi Figurine",
      image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=500",
      description: "A polished gray granite bull figurine, mimicking the large stone bovine sculptures of Hemakuta Hill.",
      aiPromptUsed: "Small stone carved bull statue, ancient ruins style granite sculpture, clean shadow, museum exhibition layout",
      authenticityGrade: "Verified Craft"
    }
  ]
};
