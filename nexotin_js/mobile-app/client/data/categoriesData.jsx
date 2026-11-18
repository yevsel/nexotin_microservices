import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { Ionicons } from '@expo/vector-icons';
import footwearImage from "../assets/categories_images/footwears.png"
import clothingImage from "../assets/categories_images/clothing.png"
import watchesImage from "../assets/categories_images/watches.png"
import glassesImage from "../assets/categories_images/glasses.png"
import cosmeticsImages from "../assets/categories_images/cosmetics.png"
import bagsImages from "../assets/categories_images/bags.png"
import accessoriesImages from "../assets/categories_images/accessories.png"
export const categories = [
    // {
    //     id:1,
    //     name:"All",
    //     image:require("../assets/categories_images/watches.png"),
    //     icon:<MaterialIcons name="category" size={20} color="gray" />,
    //     men:[],
    //     women:[],
    //     addAll:true,
    //     routeScreen:"CategoriesScreen",
    //     color:"#FFFCDE"
    // },
    {
        id:2,
        name:"Footwear",
        image:footwearImage,
        icon:<MaterialCommunityIcons name="shoe-sneaker" size={22} color="gray" />,
        men:[
                {
                    id:1,
                    name:"Sneakers",
                    image:require("../assets/categories_images/Footwear/sneakers.png")
                },
                {
                    id:2,
                    name:"Shoes & Boots",
                    image:require("../assets/categories_images/Footwear/shoes_and_boots.png")
                },
                {
                    id:3,
                    name:"Slides & Slippers",
                    image:require("../assets/categories_images/Footwear/slides_and_slippers.png")
                },
                {
                    id:4,
                    name:"Sandals",
                    image:require("../assets/categories_images/Footwear/sandals.png")
                }
            ],
        women:[
            {
                id:1,
                name:"Sneakers",
                image:require("../assets/categories_images/Footwear/sneakers.png")
            },
            {
                id:2,
                name:"Shoes & Boots",
                image:require("../assets/categories_images/Footwear/shoes_and_boots.png")
            },
            {
                id:3,
                name:"Heels",
                image:require("../assets/categories_images/Footwear/heels.png")
            },
            {
                id:3,
                name:"Slides & Slippers",
                image:require("../assets/categories_images/Footwear/slides_and_slippers.png")
            },
            {
                id:4,
                name:"Sandals",
                image:require("../assets/categories_images/Footwear/sandals.png")
            }
        ],
        addAll:false,
        routeScreen:"SpecificCategoryScreen",
        color:"#FFE8DE"
    },
    {
        id:3,
        name:"Clothing",
        image:clothingImage,
        icon:<Ionicons name="shirt" size={18} color="gray" />,
        men:[
                {
                    id:2,
                    name:"Shirts & T-Shirts",
                    image:require("../assets/categories_images/Clothing/shirts_and_t-shirts.png")
                },
                {
                    id:1,
                    name:"Suites & Blazers",
                    image:require("../assets/categories_images/Clothing/suites_and_blazers.png")
                },
                {
                    id:3,
                    name:"Trousers",
                    image:require("../assets/categories_images/Clothing/trousers.png")
                },
                {
                    id:4,
                    name:"Shorts",
                    image:require("../assets/categories_images/Clothing/shorts.png")
                },
                {
                    id:5,
                    name:"Jackets & Hoodies",
                    image:require("../assets/categories_images/Clothing/jackets_and_hoodies.png")
                },
                {
                    id:6,
                    name:"Sleep & Under wears",
                    image:require("../assets/categories_images/Clothing/sleep_and_under_wears.png")
                },
            ],
        women:[
                {
                    id:1,
                    name:"Long Dresses",
                    image:require("../assets/categories_images/Clothing/long_dresses.png")
                },
                {
                    id:2,
                    name:"Short Dresses",
                    image:require("../assets/categories_images/Clothing/short_dresses.png")
                },
                {
                    id:3,
                    name:"Blouses",
                    image:require("../assets/categories_images/Clothing/blouses.png")
                },
                {
                    id:4,
                    name:"Suites & Blazers",
                    image:require("../assets/categories_images/Clothing/suites_and_blazers.png")
                },
                {
                    id:5,
                    name:"Tank & Knit Tops",
                    image:require("../assets/categories_images/Clothing/tank_and_knit_tops.png")
                },
                {
                    id:6,
                    name:"Shirts & T-Shirts",
                    image:require("../assets/categories_images/Clothing/shirts_and_t-shirts.png")
                },
                {
                    id:7,
                    name:"Skirts",
                    image:require("../assets/categories_images/Clothing/skirts.png")
                },
                {
                    id:8,
                    name:"Trousers",
                    image:require("../assets/categories_images/Clothing/trousers.png")
                },
                {
                    id:9,
                    name:"Shorts",
                    image:require("../assets/categories_images/Clothing/shorts.png")
                },
                {
                    id:10,
                    name:"Jackets & Hoodies",
                    image:require("../assets/categories_images/Clothing/jackets_and_hoodies.png")
                },
                {
                    id:11,
                    name:"Sleep & Under wears",
                    image:require("../assets/categories_images/Clothing/sleep_and_under_wears.png")
                }
            ],
        addAll:false,
        routeScreen:"SpecificCategoryScreen",
        color:"#EDFFDE"
    },
    {
        id:4,
        name:"Watches",
        image:watchesImage,
        icon:<Feather name="watch" size={20} color="gray" />,
        men:[
                {
                    id:1,
                    name:"Digital",
                    image:require("../assets/categories_images/Watches/digital_watches.png")
                },
                {
                    id:2,
                    name:"Analogue",
                    image:require("../assets/categories_images/Watches/digital_watches.png")
                },
                {
                    id:3,
                    name:"Leather",
                    image:require("../assets/categories_images/Watches/leather.png")
                },
                {
                    id:4,
                    name:"Rubber",
                    image:require("../assets/categories_images/Watches/rubber.png")
                },
                {
                    id:4,
                    name:"Metal",
                    image:require("../assets/categories_images/Watches/metal.png")
                }
            ],
        women:[
            {
                id:1,
                name:"Digital",
                image:require("../assets/categories_images/Watches/digital_watches.png")
            },
            {
                id:2,
                name:"Analogue",
                image:require("../assets/categories_images/Watches/digital_watches.png")
            },
            {
                id:3,
                name:"Leather",
                image:require("../assets/categories_images/Watches/leather.png")
            },
            {
                id:4,
                name:"Rubber",
                image:require("../assets/categories_images/Watches/rubber.png")
            },
            {
                id:4,
                name:"Metal",
                image:require("../assets/categories_images/Watches/metal.png")
            }
        ],
        addAll:true,
        routeScreen:"SpecificCategoryScreen",
        color:"#DEEDFF"
    },
    {
        id:5,
        name:"Glasses",
        image:glassesImage,
        icon:<Ionicons name="glasses-outline" size={28} color="gray" />,
        men:[
                {
                    id:1,
                    name:"Plain Glass",
                    image:require("../assets/categories_images/Glasses/plain.png")
                },
                {
                    id:2,
                    name:"Tinted Glass",
                    image:require("../assets/categories_images/Glasses/tinted.png")
                },
                {
                    id:3,
                    name:"Plastic Frame",
                    image:require("../assets/categories_images/Glasses/plastic.png")
                },
                {
                    id:4,
                    name:"Metal Frame",
                    image:require("../assets/categories_images/Glasses/metal.png")
                },
                {
                    id:5,
                    name:"Sports Glasses",
                    image:require("../assets/categories_images/Glasses/sports.png")
                },
        ],
        women:[
                {
                    id:1,
                    name:"Plain Glass",
                    image:require("../assets/categories_images/Glasses/plain.png")
                },
                {
                    id:2,
                    name:"Tinted Glass",
                    image:require("../assets/categories_images/Glasses/tinted.png")
                },
                {
                    id:3,
                    name:"Plastic Frame",
                    image:require("../assets/categories_images/Glasses/plastic.png")
                },
                {
                    id:4,
                    name:"Metal Frame",
                    image:require("../assets/categories_images/Glasses/metal.png")
                },
                {
                    id:5,
                    name:"Sports Glasses",
                    image:require("../assets/categories_images/Glasses/sports.png")
                }
        ],
        addAll:true,
        routeScreen:"SpecificCategoryScreen",
        color:"#FFDEFC"
    },
    {
        id:6,
        name:"Cosmetics",
        image:cosmeticsImages,
        icon:<MaterialCommunityIcons name="sprinkler" size={20} color="gray" />,
        men:[
                {
                    id:1,
                    name:"Perfume & Deodorant",
                    image:require("../assets/categories_images/Cosmetics/perfume_and_deodorant.png")
                },
                {
                    id:2,
                    name:"Pomade & Lotion",
                    image:require("../assets/categories_images/Cosmetics/pomade_and_lotion.png")
                },
                {
                    id:3,
                    name:"Scrub & Cleanser",
                    image:require("../assets/categories_images/Cosmetics/scrub_and_cleanser.png")
                },
                {
                    id:4,
                    name:"Nail Products",
                    image:require("../assets/categories_images/Cosmetics/nail_products.png")
                },
                {
                    id:5,
                    name:"Soap & Shampoo",
                    image:require("../assets/categories_images/Cosmetics/soap_and_shampoo.png")
                },
                {
                    id:6,
                    name:"Hair Extension & Acc",
                    image:require("../assets/categories_images/Cosmetics/hair_extention_and_acc.png")
                },
                {
                    id:6,
                    name:"Cosmetic oils",
                    image:require("../assets/categories_images/Cosmetics/cosmetic_oils.png")
                }
            ],
        women:[
                {
                    id:1,
                    name:"Perfume & Deodorant",
                    image:require("../assets/categories_images/Cosmetics/perfume_and_deodorant.png")
                },
                {
                    id:2,
                    name:"Pomade & Lotion",
                    image:require("../assets/categories_images/Cosmetics/pomade_and_lotion.png")
                },
                {
                    id:3,
                    name:"Scrub & Cleanser",
                    image:require("../assets/categories_images/Cosmetics/scrub_and_cleanser.png")
                },
                {
                    id:4,
                    name:"Nail Products",
                    image:require("../assets/categories_images/Cosmetics/nail_products.png")
                },
                {
                    id:5,
                    name:"Soap & Shampoo",
                    image:require("../assets/categories_images/Cosmetics/soap_and_shampoo.png")
                },
                {
                    id:6,
                    name:"Hair Extension & Acc",
                    image:require("../assets/categories_images/Cosmetics/hair_extention_and_acc.png")
                },
                {
                    id:6,
                    name:"Cosmetic oils",
                    image:require("../assets/categories_images/Cosmetics/cosmetic_oils.png")
                }
            ],
        addAll:true,
        routeScreen:"SpecificCategoryScreen",
        color:"#FFFCDE"
    },
    {
        id:7,
        name:"Bags",
        image:bagsImages,
        icon:<MaterialCommunityIcons name="bag-suitcase" size={20} color="gray" />,
        men:[
                {
                    id:1,
                    name:"Backpack",
                    image:require("../assets/categories_images/Bags/backpack.png")
                },
                {
                    id:2,
                    name:"Laptop Bag",
                    image:require("../assets/categories_images/Bags/laptopbag.png")
                },
                {
                    id:3,
                    name:"Shoulder, Side & Waist",
                    image:require("../assets/categories_images/Bags/shoulder_waist_bag.png")
                },
                {
                    id:4,
                    name:"Wallet, Purse & Clutch",
                    image:require("../assets/categories_images/Bags/wallet.png")
                },
                {
                    id:5,
                    name:"Duffel & Suite Case",
                    image:require("../assets/categories_images/Bags/duffle.png")
                }
            ],
        women:[
            {
                id:1,
                name:"Backpack",
                image:require("../assets/categories_images/Bags/backpack.png")
            },
            {
                id:2,
                name:"Hand Bag",
                image:require("../assets/categories_images/Bags/hand_bag.png")
            },
            {
                id:3,
                name:"Laptop Bag",
                image:require("../assets/categories_images/Bags/laptopbag.png")
            },
            {
                id:4,
                name:"Shoulder, Side & Waist",
                image:require("../assets/categories_images/Bags/shoulder_waist_bag.png")
            },
            {
                id:5,
                name:"Wallet, Purse & Clutch",
                image:require("../assets/categories_images/Bags/wallet.png")
            },
            {
                id:6,
                name:"Duffel & Suite Case",
                image:require("../assets/categories_images/Bags/duffle.png")
            }
        ],
        routeScreen:"SpecificCategoryScreen",
        color:"#FFE8DE"
    },
    {
        id:8,
        name:"Accessories",
        image:accessoriesImages,
        icon:<FontAwesome name="shopping-bag" size={15} color="gray" />,
        men:[
                {
                    id:1,
                    name:"Neck Chain & Ear Ring",
                    image:require("../assets/categories_images/Accessories/neckchain.png")
                },
                {
                    id:2,
                    name:"Rings & Bracelet",
                    image:require("../assets/categories_images/Accessories/rings.png")
                },
                {
                    id:3,
                    name:"Belt, Tie & Socks",
                    image:require("../assets/categories_images/Accessories/belts.png")
                },
                {
                    id:4,
                    name:"Cup & Scarf",
                    image:require("../assets/categories_images/Accessories/caps.png")
                },
            ],
        women:[
            {
                id:1,
                name:"Neck Chain & Ear Ring",
                image:require("../assets/categories_images/Accessories/neckchain.png")
            },
            {
                id:2,
                name:"Rings & Bracelet",
                image:require("../assets/categories_images/Accessories/rings.png")
            },
            {
                id:3,
                name:"Belt, Tie & Socks",
                image:require("../assets/categories_images/Accessories/belts.png")
            },
            {
                id:4,
                name:"Cup & Scarf",
                image:require("../assets/categories_images/Accessories/caps.png")
            },
        ],
        addAll:true,
        routeScreen:"SpecificCategoryScreen",
        color:"#DEEDFF"
    },
        {
        id:1,
        name:"",
        image:"",
        icon:"",
        men:[],
        women:[],
        addAll:true,
        routeScreen:"",
        color:"#FFFCDE"
    },
]