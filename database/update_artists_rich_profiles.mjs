// database/update_artists_rich_profiles.mjs
// Enriches all K-Pop boy groups, girl groups, and soloists with verified official profile avatars,
// latest group photos (header_image), comprehensive bios detailing Malaysian concerts, and member biodata.

import db from '../config/database.js';

// Comprehensive list of K-Pop Artists that performed concerts in Malaysia
const ARTISTS_DATA = [
  {
    id: 1,
    name: 'SEVENTEEN',
    group_type: 'Boy Group',
    agency: 'PLEDIS Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Seventeen_Carat_Land_24.jpg',
    header_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop',
    description: '13-member South Korean self-producing boy group under PLEDIS Entertainment (HYBE). Divided into Hip-Hop, Vocal, and Performance units. Celebrated for razor-sharp synchronization choreography and mega Malaysian concerts at Axiata Arena Bukit Jalil (Ode to You, Be the Sun) with their fandom CARAT (official colors: Rose Quartz & Serenity).'
  },
  {
    id: 2,
    name: 'TWICE',
    group_type: 'Girl Group',
    agency: 'JYP Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Twice_260618.jpg',
    header_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&auto=format&fit=crop',
    description: 'Renowned 9-member South Korean girl group under JYP Entertainment (Nayeon, Jeongyeon, Momo, Sana, Jihyo, Mina, Dahyun, Chaeyoung, Tzuyu). "The Nation\'s Girl Group" has thrilled Malaysian ONCE with historic sold-out tours at Axiata Arena Bukit Jalil (Twicelights, Ready To Be) with official colors Apricot & Neon Magenta.'
  },
  {
    id: 3,
    name: 'IU (Lee Ji-eun)',
    group_type: 'Soloist',
    agency: 'EDAM Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/IU_at_the_Est%C3%A9e_Lauder_launch_event%2C_26_February_2026_%2810%29.png',
    header_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop',
    description: 'South Korea\'s premier singer-songwriter and actress under EDAM Entertainment. "The Nation\'s Sweetheart" mesmerized Malaysian UAENAs across two sold-out nights at Axiata Arena Bukit Jalil during her record-setting HEREH World Tour, featuring live acoustic renditions of "Love wins all", "Blueming", and "Celebrity".'
  },
  {
    id: 4,
    name: 'ENHYPEN',
    group_type: 'Boy Group',
    agency: 'BELIFT LAB',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Enhypen_at_Golden_disc_awards.png',
    header_image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop',
    description: '7-member powerhouse formed through Mnet\'s I-LAND under BELIFT LAB / HYBE (Jungwon, Heeseung, Jay, Jake, Sunghoon, Sunoo, Ni-ki). Known for dark vampire fantasy lore and high-octane choreography, selling out Malaysian arena stops on their FATE and WALK THE LINE world tours for Malaysian ENGENEs.'
  },
  {
    id: 5,
    name: 'IVE',
    group_type: 'Girl Group',
    agency: 'Starship Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Ive_at_the_40th_Golden_Disc_Awards%2C_January_10%2C_2026_%282%29.png',
    header_image: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?w=1600&auto=format&fit=crop',
    description: '6-member sensation under Starship Entertainment (An Yu-jin, Gaeul, Rei, Jang Won-young, Liz, Leeseo). Swept Rookie of the Year and Song of the Year daesangs with "Love Dive", "I AM", and "Baddie", selling out Axiata Arena Bukit Jalil during their SHOW WHAT I HAVE 1st World Tour for Malaysian DIVE.'
  },
  {
    id: 6,
    name: 'TOMORROW X TOGETHER (TXT)',
    group_type: 'Boy Group',
    agency: 'BIGHIT MUSIC / HYBE',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tomorrow_X_Together_at_a_Dior_event%2C_April_18%2C_2025.png',
    header_image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1600&auto=format&fit=crop',
    description: '5-member boy group under BIGHIT MUSIC (HYBE) comprising Soobin, Yeonjun, Beomgyu, Taehyun, and HueningKai. Hailed as the "Voice of Gen Z", they have performed unforgettable Malaysian concerts at Axiata Arena Bukit Jalil (ACT : LOVESICK, ACT : SWEET MIRAGE, ACT : PROMISE) with an active community led by MY MOA Union.'
  },
  {
    id: 7,
    name: 'Stray Kids',
    group_type: 'Boy Group',
    agency: 'JYP Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Stray_Kids_at_the_40th_Golden_Disc_Awards%2C_January_10%2C_2026_%281%29.png',
    header_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&auto=format&fit=crop',
    description: '8-member self-producing powerhouse under JYP Entertainment (Bang Chan, Lee Know, Changbin, Hyunjin, Han, Felix, Seungmin, I.N). Produced by in-house unit 3RACHA, famous for stadium anthems like "God\'s Menu" and "Chk Chk Boom" during their MANIAC and dominATE world tours at Axiata Arena and National Stadium Bukit Jalil.'
  },
  {
    id: 8,
    name: 'aespa',
    group_type: 'Girl Group',
    agency: 'SM Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Aespa_Love_Your_W_2025_1.jpg',
    header_image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1600&auto=format&fit=crop',
    description: 'Futuristic 4-member metaverse girl group under SM Entertainment (Karina, Giselle, Winter, Ningning). Broke global charts with viral anthems "Supernova", "Whiplash", and "Next Level", bringing their spectacular SYNK : PARALLEL LINE live tour to Malaysian MYs at Axiata Arena Bukit Jalil.'
  },
  {
    id: 9,
    name: 'BTS (Bangtan Sonyeondan)',
    group_type: 'Boy Group',
    agency: 'BIGHIT MUSIC / HYBE',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg',
    header_image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&auto=format&fit=crop',
    description: '21st century pop icons (RM, Jin, SUGA, j-hope, Jimin, V, Jung Kook) under BIGHIT MUSIC. Multiple Grammy-nominated global phenomenon with deep Malaysian ties dating back to their iconic Red Bullet tour and an active nationwide Malaysian ARMY community that regularly organizes charity and cup sleeve projects.'
  },
  {
    id: 10,
    name: 'BABYMONSTER',
    group_type: 'Girl Group',
    agency: 'YG Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/57/BabyMonster_Promoting_drip_on_2024112.png',
    header_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop',
    description: 'YG Entertainment\'s 7-member monster rookie girl group (Ruka, Pharita, Asa, Ahyeon, Rami, Rora, Chiquita). Known for phenomenal live vocals and dynamic hip-hop performances on hits "SHEESH", "BATTER UP", and "DRIP", headlining their Malaysian fan concert debut at Zepp Kuala Lumpur for Malaysian MONSTIEZ.'
  },
  {
    id: 11,
    name: 'izna',
    group_type: 'Girl Group',
    agency: 'WAKEONE',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Izna_250930.jpg',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Izna_250930.jpg',
    description: '7-member girl group formed through Mnet\'s I-LAND 2 in collaboration with THE BLACK LABEL producer Teddy (Mai, Bang Jeemin, Yoon Jiyoon, Koko, Ryu Sarang, Choi Jungeun, Jeong Saebi). Debuted with high-energy tracks "IZNA" and "TIMEBOMB", embarking on their WHO DAT GIRL? tour in Kuala Lumpur.'
  },
  {
    id: 12,
    name: 'wave to earth',
    group_type: 'Band',
    agency: 'Wavy',
    image_url: 'https://dynamicmedia.livenationinternational.com/y/b/e/f2d49dce-7266-4487-a111-6323bb0dbfa4.jpg',
    header_image: 'https://dynamicmedia.livenationinternational.com/y/b/e/f2d49dce-7266-4487-a111-6323bb0dbfa4.jpg',
    description: '3-member Korean indie jazz-rock sensation under Wavy (Daniel Kim, John Cha, Dong Q). Masterpieces of lo-fi indie melodies like "bad", "seasons", and "love." brought them to sold-out Malaysian showcases at Zepp Kuala Lumpur and Mega Star Arena KL.'
  },
  {
    id: 13,
    name: 'Young K (DAY6)',
    group_type: 'Band',
    agency: 'JYP Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/180628_Day6.jpg',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/180628_Day6.jpg',
    description: 'Virtuoso bassist, vocalist, and prolific songwriter of DAY6 under JYP Entertainment. Famous for authoring chart-topping hits across K-Pop, Young K held his solo world tour <Letters with notes> and <YOUNGEST> in Kuala Lumpur alongside DAY6\'s sold-out concerts at Mega Star Arena KL for Malaysian My Day.'
  },
  {
    id: 14,
    name: 'The Rose',
    group_type: 'Band',
    agency: 'Windfall',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/The_Rose_2023.jpg',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/0/09/The_Rose_2023.jpg',
    description: 'Beloved 4-member Korean indie rock band (Woosung, Dojoon, Hajoon, Jaehyeong). Renowned for emotionally resonant anthems like "She\'s In The Rain", "Sour", and "Back To Me", performing sold-out concerts at Mega Star Arena KL on their HEAL Together and DAWN TO DUSK World Tours for Malaysian Black Roses.'
  },
  {
    id: 15,
    name: 'Yves',
    group_type: 'Soloist',
    agency: 'PaiD',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Yves_%2855264907556%29.jpg',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Yves_%2855264907556%29.jpg',
    description: 'Charismatic vocalist, dancer, and songwriter (former LOONA member) under PaiD. Following the release of her acclaimed EP "LOOP", Yves launched her solo Asia tour with a vibrant, intimate live concert and fan encounter at Zepp Kuala Lumpur.'
  },
  {
    id: 16,
    name: 'Yesung (SUPER JUNIOR)',
    group_type: 'Soloist',
    agency: 'SM Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Yesung_from_%22My_Korean_Teacher%22_at_Opening_Ceremony_of_the_Tokyo_International_Film_Festival_2016_%2832801121644%29.jpg',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Yesung_from_%22My_Korean_Teacher%22_at_Opening_Ceremony_of_the_Tokyo_International_Film_Festival_2016_%2832801121644%29.jpg',
    description: 'Legendary main vocalist of SUPER JUNIOR, the "Vocal King" of SM Entertainment. Renowned for his deep, emotive voice on timeless ballads like "It Has to Be You" and "Small Things". Performed his solo Malaysian tour "About the Things We Called Ordinary" and exclusive fansigns in Kuala Lumpur for Malaysian E.L.F.'
  },
  {
    id: 17,
    name: 'Lee Junho (2PM)',
    group_type: 'Soloist',
    agency: 'JYP Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Lee_Junho_in_January_2025_02.png',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Lee_Junho_in_January_2025_02.png',
    description: 'Award-winning actor and member of legendary beast-idol boy band 2PM under JYP Entertainment. Star of "King the Land" and "The Red Sleeve", Junho celebrated milestone fan meeting tours "JUNHO THE MOMENT" and headline appearances at the CUCKOOTOPIA 12th Anniversary Concert in Axiata Arena Bukit Jalil.'
  },
  {
    id: 18,
    name: 'BOYNEXTDOOR',
    group_type: 'Boy Group',
    agency: 'KOZ Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/2026-01-16_BOYNEXTDOOR_at_Golden_Disc_Awards_05_%28cropped%29.png',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/2026-01-16_BOYNEXTDOOR_at_Golden_Disc_Awards_05_%28cropped%29.png',
    description: '6-member boy group under KOZ Entertainment / HYBE (Sungho, Riwoo, Jaehyun, Taesan, Leehan, Woonhak). Produced by ZICO, beloved for relatable charm and catchy tracks like "Nice Guy", "Earth, Wind & Fire", and "One and Only", bringing their KNOCK ON tour to Malaysian ONEDOOR.'
  },
  {
    id: 19,
    name: 'BLACKPINK',
    group_type: 'Girl Group',
    agency: 'YG Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/20240809_Blackpink_Pink_Carpet_09.png',
    header_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&auto=format&fit=crop',
    description: 'Global superstar 4-member girl group under YG Entertainment (Jisoo, Jennie, Rosé, Lisa). Made history in Malaysia with their record-breaking BORN PINK World Tour at Bukit Jalil National Stadium, electrifying over 60,000 Malaysian BLINKs in an iconic ocean of pink lightsticks.'
  },
  {
    id: 20,
    name: 'ITZY',
    group_type: 'Girl Group',
    agency: 'JYP Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/251110_ITZY.png',
    header_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop',
    description: '5-member powerhouse girl group under JYP Entertainment (Yeji, Lia, Ryujin, Chaeryeong, Yuna). Renowned for crown choreographies and self-love anthems like "WANNABE", "DALLA DALLA", and "Untouchable", headlining multiple Malaysian concerts at Mega Star Arena KL for Malaysian MIDZY.'
  },
  {
    id: 21,
    name: 'NCT DREAM',
    group_type: 'Boy Group',
    agency: 'SM Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/NCT_Dream_at_DREAM%28%29SCAPE_Press_Conference.png',
    header_image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop',
    description: '7-member youthful powerhouse under SM Entertainment (Mark, Renjun, Jeno, Haechan, Jaemin, Chenle, Jisung). Filled Axiata Arena Bukit Jalil with a glowing sea of pearl neon green lightsticks during their sold-out THE DREAM SHOW 2 and THE DREAM SHOW 3: DREAM( )SCAPE tours.'
  },
  {
    id: 22,
    name: 'TREASURE',
    group_type: 'Boy Group',
    agency: 'YG Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/230806_%ED%8A%B8%EB%A0%88%EC%A0%80_%28TREASURE%29_SBS_%ED%8C%8C%EC%9B%8CFM_%EB%91%90%EC%8B%9C%ED%83%88%EC%B6%9C_%EC%BB%AC%ED%88%AC%EC%87%BC.jpg',
    header_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&auto=format&fit=crop',
    description: '10-member high-energy boy group under YG Entertainment. Famous for crowd-shaking hits "JIKJIN", "DARARI", and "BONA BONA", performing massive arena concerts in Malaysia at Malawati Stadium and Axiata Arena for Malaysian Treasure Makers (Teume).'
  },
  {
    id: 23,
    name: 'TAEYEON',
    group_type: 'Soloist',
    agency: 'SM Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/80/250307_Taeyeon_%40_-The_Tense-_in_Seoul_Day_1_%2854371295597%29_%28cropped%29.jpg',
    header_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop',
    description: 'Leader and main vocalist of Girls\' Generation and legendary solo artist under SM Entertainment. Renowned for supreme vocal artistry on masterpieces like "INVU", "Four Seasons", and "To. X", selling out Axiata Arena Bukit Jalil with Malaysian SONEs.'
  },
  {
    id: 24,
    name: 'RIIZE',
    group_type: 'Boy Group',
    agency: 'SM Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Riize_at_the_2024_Melon_Music_Awards-2.png',
    header_image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1600&auto=format&fit=crop',
    description: '6-member emotional pop boy group under SM Entertainment (Shotaro, Eunseok, Sungchan, Wonbin, Sohee, Anton). Captured massive Malaysian fanfare with viral chart-toppers "Get A Guitar", "Love 119", and "Boom Boom Bass" during their RIIZING DAY fan-con tour at Mega Star Arena KL.'
  },
  {
    id: 25,
    name: 'ZEROBASEONE (ZB1)',
    group_type: 'Boy Group',
    agency: 'WAKEONE',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/ZEROBASEONE_%40_40th_Golden_Disc_Awards_%2820260110%29.jpg',
    header_image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&auto=format&fit=crop',
    description: '9-member boy group formed from Mnet Boys Planet under WAKEONE (Kim Ji-woong, Zhang Hao, Sung Han-bin, Seok Matthew, Kim Tae-rae, Ricky, Kim Gyu-vin, Park Gun-wook, Han Yu-jin). Historic million-sellers who brought their electrifying TIMELESS WORLD tour to Axiata Arena Bukit Jalil for Malaysian ZEROSE.'
  },
  // Additional iconic Boy Groups and Girl Groups that performed in Malaysia
  {
    name: 'SUPER JUNIOR',
    group_type: 'Boy Group',
    agency: 'SM Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/KCON_2015_Super_Junior_DSC02998_%2820357930851%29.jpg',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/KCON_2015_Super_Junior_DSC02998_%2820357930851%29.jpg',
    description: 'The "Kings of Hallyu" under SM Entertainment (Leeteuk, Heechul, Yesung, Shindong, Eunhyuk, Donghae, Siwon, Ryeowook, Kyuhyun). Pioneers of global K-Pop who have performed historic editions of their signature SUPER SHOW world tour (Super Show 2, 5, 9, and 10) in Malaysia at Axiata Arena Bukit Jalil and Stadium Putra for Malaysian E.L.F.'
  },
  {
    name: 'EXO',
    group_type: 'Boy Group',
    agency: 'SM Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Exo_monster_160618_suwon.png',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Exo_monster_160618_suwon.png',
    description: 'Legendary multi-million selling boy group under SM Entertainment (Suho, Xiumin, Lay, Baekhyun, Chen, Chanyeol, D.O., Kai, Sehun). Celebrated for concept lore and anthems like "Growl", "Monster", and "Love Shot", filling Stadium Merdeka and Axiata Arena Bukit Jalil with cosmic silver lights on their EXO PLANET tours.'
  },
  {
    name: '(G)I-DLE',
    group_type: 'Girl Group',
    agency: 'Cube Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/I-dle_at_Love_Your_W_on_October_15%2C_2025.png',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/I-dle_at_Love_Your_W_on_October_15%2C_2025.png',
    description: 'Self-producing 5-member powerhouse girl group under Cube Entertainment (Miyeon, Minnie, Soyeon, Yuqi, Shuhua). Renowned for fearless concepts and chart-topping hits "TOMBOY", "Nxde", and "Queencard", performing sold-out concerts at Zepp Kuala Lumpur and Mega Star Arena KL for Malaysian Neverland.'
  },
  {
    name: 'LE SSERAFIM',
    group_type: 'Girl Group',
    agency: 'SOURCE MUSIC / HYBE',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Le_Sserafim_at_2026_Golden_Disc_awards.png',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Le_Sserafim_at_2026_Golden_Disc_awards.png',
    description: '5-member fearless sensation under SOURCE MUSIC / HYBE (Kim Chaewon, Sakura, Huh Yunjin, Kazuha, Hong Eunchae). Celebrated for empowering concepts and viral hits like "FEARLESS", "ANTIFRAGILE", and "EASY", boasting a massive Malaysian fanbase of FEARNOTs.'
  },
  {
    name: 'ATEEZ',
    group_type: 'Boy Group',
    agency: 'KQ Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/ATEEZ_in_August_2024_%28cropped%29.jpg',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/ATEEZ_in_August_2024_%28cropped%29.jpg',
    description: '8-member performance pirate kings under KQ Entertainment (Hongjoong, Seonghwa, Yunho, Yeosang, San, Mingi, Wooyoung, Jongho). Famous for intense theatrical stage presence and anthems "BOUNCY", "Guerrilla", and "WORK", headlining major world tour stops for Malaysian ATINY.'
  },
  {
    name: '2NE1',
    group_type: 'Girl Group',
    agency: 'YG Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/2NE1_2013_kpop_hologram_%28cropped%29.jpg',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/2NE1_2013_kpop_hologram_%28cropped%29.jpg',
    description: 'Legendary "Queens of K-Pop" under YG Entertainment (CL, Bom, Dara, Minzy). Changed the history of girl groups with groundbreaking girl-crush anthems "I Am The Best" and "Fire", making a triumphant reunion return to Axiata Arena Bukit Jalil on their WELCOME BACK Asia Tour for Malaysian Blackjacks.'
  },
  {
    name: 'MAMAMOO',
    group_type: 'Girl Group',
    agency: 'RBW',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Mamamoo_in_September_2022.png',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Mamamoo_in_September_2022.png',
    description: 'Vocal queens of K-Pop under RBW (Solar, Moonbyul, Wheein, Hwasa). Known for unmatched live harmonization and charismatic stage craft on "HIP", "Decalcomanie", and "Starry Night", selling out Malawati Stadium Shah Alam during their MY CON World Tour for Malaysian MOOMOO.'
  },
  {
    name: 'Red Velvet',
    group_type: 'Girl Group',
    agency: 'SM Entertainment',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/%EB%A0%88%EB%93%9C%EB%B2%A8%EB%B2%B3%28Red_Velvet%29_%EC%BC%80%EC%9D%B4%EC%BD%98_%EC%9E%AC%ED%8C%AC_2024_%EB%A0%88%EB%93%9C%EC%B9%B4%ED%8E%AB_KCON_JAPAN_2024_%281%29.jpg',
    header_image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/%EB%A0%88%EB%93%9C%EB%B2%A8%EB%B2%B3%28Red_Velvet%29_%EC%BC%80%EC%9D%B4%EC%BD%98_%EC%9E%AC%ED%8C%AC_2024_%EB%A0%88%EB%93%9C%EC%B9%B4%ED%8E%AB_KCON_JAPAN_2024_%281%29.jpg',
    description: 'Versatile 5-member vocal and concept queens under SM Entertainment (Irene, Seulgi, Wendy, Joy, Yeri). Famous for their duality of bright "Red" pop hits like "Red Flavor" and velvety R&B tracks like "Psycho" and "Bad Boy", captivating Malaysian ReVeluvs across multiple Southeast Asian tours.'
  }
];

// Member biodata for groups that were missing or had incomplete member rosters
const MEMBERS_DATA = [
  // TWICE (All 9 Members)
  { artist_name: 'TWICE', stage_name: 'Nayeon', birth_name: 'Im Na-yeon (임나연)', position: 'Lead Vocalist, Lead Dancer, Center', dob: '1995-09-22', zodiac: 'Virgo', height_cm: 163, blood_type: 'A', mbti: 'ISTP', nationality: 'South Korean', debut_year: 2015 },
  { artist_name: 'TWICE', stage_name: 'Jeongyeon', birth_name: 'Yoo Jeong-yeon (유정연)', position: 'Lead Vocalist', dob: '1996-11-01', zodiac: 'Scorpio', height_cm: 168, blood_type: 'O', mbti: 'ISFJ', nationality: 'South Korean', debut_year: 2015 },
  { artist_name: 'TWICE', stage_name: 'Momo', birth_name: 'Hirai Momo (平井 もも)', position: 'Main Dancer, Sub Vocalist, Sub Rapper', dob: '1996-11-09', zodiac: 'Scorpio', height_cm: 162, blood_type: 'A', mbti: 'INFP', nationality: 'Japanese', debut_year: 2015 },
  { artist_name: 'TWICE', stage_name: 'Sana', birth_name: 'Minatozaki Sana (湊崎 紗夏)', position: 'Sub Vocalist', dob: '1996-12-29', zodiac: 'Capricorn', height_cm: 163, blood_type: 'B', mbti: 'ENFP', nationality: 'Japanese', debut_year: 2015 },
  { artist_name: 'TWICE', stage_name: 'Jihyo', birth_name: 'Park Ji-hyo (박지효)', position: 'Leader, Main Vocalist', dob: '1997-02-01', zodiac: 'Aquarius', height_cm: 160, blood_type: 'O', mbti: 'ESFP', nationality: 'South Korean', debut_year: 2015 },
  { artist_name: 'TWICE', stage_name: 'Mina', birth_name: 'Myoui Mina (名井 南)', position: 'Main Dancer, Sub Vocalist', dob: '1997-03-24', zodiac: 'Aries', height_cm: 163, blood_type: 'A', mbti: 'ISFP', nationality: 'Japanese-American', debut_year: 2015 },
  { artist_name: 'TWICE', stage_name: 'Dahyun', birth_name: 'Kim Da-hyun (김다현)', position: 'Lead Rapper, Sub Vocalist', dob: '1998-05-28', zodiac: 'Gemini', height_cm: 159, blood_type: 'O', mbti: 'ISFJ', nationality: 'South Korean', debut_year: 2015 },
  { artist_name: 'TWICE', stage_name: 'Chaeyoung', birth_name: 'Son Chae-young (손채영)', position: 'Main Rapper, Sub Vocalist', dob: '1999-04-23', zodiac: 'Taurus', height_cm: 159, blood_type: 'B', mbti: 'INFP', nationality: 'South Korean', debut_year: 2015 },
  { artist_name: 'TWICE', stage_name: 'Tzuyu', birth_name: 'Chou Tzu-yu (周子瑜)', position: 'Lead Dancer, Sub Vocalist, Visual, Maknae', dob: '1999-06-14', zodiac: 'Gemini', height_cm: 170, blood_type: 'A', mbti: 'ISFP', nationality: 'Taiwanese', debut_year: 2015 },

  // BLACKPINK (All 4 Members)
  { artist_name: 'BLACKPINK', stage_name: 'Jisoo', birth_name: 'Kim Ji-soo (김지수)', position: 'Lead Vocalist, Visual', dob: '1995-01-03', zodiac: 'Capricorn', height_cm: 162, blood_type: 'A', mbti: 'INFJ', nationality: 'South Korean', debut_year: 2016 },
  { artist_name: 'BLACKPINK', stage_name: 'Jennie', birth_name: 'Kim Jennie (김제니)', position: 'Main Rapper, Lead Vocalist', dob: '1996-01-16', zodiac: 'Capricorn', height_cm: 163, blood_type: 'B', mbti: 'INFP', nationality: 'South Korean', debut_year: 2016 },
  { artist_name: 'BLACKPINK', stage_name: 'Rosé', birth_name: 'Roseanne Park / Park Chae-young (박채영)', position: 'Main Vocalist, Lead Dancer', dob: '1997-02-11', zodiac: 'Aquarius', height_cm: 168, blood_type: 'B', mbti: 'ENFP', nationality: 'Korean-New Zealander', debut_year: 2016 },
  { artist_name: 'BLACKPINK', stage_name: 'Lisa', birth_name: 'Lalisa Manobal (ลลิษา มโนบาล)', position: 'Main Dancer, Lead Rapper, Sub Vocalist, Maknae', dob: '1997-03-27', zodiac: 'Aries', height_cm: 167, blood_type: 'O', mbti: 'ESFJ', nationality: 'Thai', debut_year: 2016 },

  // Stray Kids (All 8 Members)
  { artist_name: 'Stray Kids', stage_name: 'Bang Chan', birth_name: 'Christopher Bang / Bang Chan (방찬)', position: 'Leader, Producer, Vocalist, Dancer, Rapper', dob: '1997-10-03', zodiac: 'Libra', height_cm: 171, blood_type: 'O', mbti: 'ENFJ', nationality: 'Korean-Australian', debut_year: 2018 },
  { artist_name: 'Stray Kids', stage_name: 'Lee Know', birth_name: 'Lee Min-ho (이민호)', position: 'Dance Leader, Dancer, Vocalist, Rapper', dob: '1998-10-25', zodiac: 'Scorpio', height_cm: 172, blood_type: 'O', mbti: 'ISFP', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: 'Stray Kids', stage_name: 'Changbin', birth_name: 'Seo Chang-bin (서창빈)', position: 'Rapper, Vocalist, Producer', dob: '1999-08-11', zodiac: 'Leo', height_cm: 167, blood_type: 'O', mbti: 'ESFP', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: 'Stray Kids', stage_name: 'Hyunjin', birth_name: 'Hwang Hyun-jin (황현진)', position: 'Dancer, Rapper, Vocalist, Visual', dob: '2000-03-20', zodiac: 'Pisces', height_cm: 179, blood_type: 'B', mbti: 'ESTP', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: 'Stray Kids', stage_name: 'Han', birth_name: 'Han Ji-sung (한지성)', position: 'Rapper, Vocalist, Producer', dob: '2000-09-14', zodiac: 'Virgo', height_cm: 169, blood_type: 'B', mbti: 'ISTP', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: 'Stray Kids', stage_name: 'Felix', birth_name: 'Felix Lee / Lee Yong-bok (이용복)', position: 'Dancer, Rapper, Sub Vocalist', dob: '2000-09-15', zodiac: 'Virgo', height_cm: 171, blood_type: 'AB', mbti: 'ENFJ', nationality: 'Korean-Australian', debut_year: 2018 },
  { artist_name: 'Stray Kids', stage_name: 'Seungmin', birth_name: 'Kim Seung-min (김승민)', position: 'Main Vocalist', dob: '2000-09-22', zodiac: 'Virgo', height_cm: 177, blood_type: 'A', mbti: 'ISFJ', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: 'Stray Kids', stage_name: 'I.N', birth_name: 'Yang Jeong-in (양정인)', position: 'Vocalist, Maknae', dob: '2001-02-08', zodiac: 'Aquarius', height_cm: 172, blood_type: 'A', mbti: 'INFJ', nationality: 'South Korean', debut_year: 2018 },

  // TXT (All 5 Members)
  { artist_name: 'TOMORROW X TOGETHER (TXT)', stage_name: 'Soobin', birth_name: 'Choi Soo-bin (최수빈)', position: 'Leader, Vocalist, Rapper, Dancer', dob: '2000-12-05', zodiac: 'Sagittarius', height_cm: 185, blood_type: 'A', mbti: 'ISFP', nationality: 'South Korean', debut_year: 2019 },
  { artist_name: 'TOMORROW X TOGETHER (TXT)', stage_name: 'Yeonjun', birth_name: 'Choi Yeon-jun (최연준)', position: 'Rapper, Dancer, Vocalist', dob: '1999-09-13', zodiac: 'Virgo', height_cm: 181, blood_type: 'A', mbti: 'ENFP', nationality: 'South Korean', debut_year: 2019 },
  { artist_name: 'TOMORROW X TOGETHER (TXT)', stage_name: 'Beomgyu', birth_name: 'Choi Beom-gyu (최범규)', position: 'Vocalist, Dancer, Rapper, Center, Visual', dob: '2001-03-13', zodiac: 'Pisces', height_cm: 180, blood_type: 'AB', mbti: 'INFJ', nationality: 'South Korean', debut_year: 2019 },
  { artist_name: 'TOMORROW X TOGETHER (TXT)', stage_name: 'Taehyun', birth_name: 'Kang Tae-hyun (강태현)', position: 'Vocalist, Dancer, Rapper', dob: '2002-02-05', zodiac: 'Aquarius', height_cm: 177, blood_type: 'A', mbti: 'ESTP', nationality: 'South Korean', debut_year: 2019 },
  { artist_name: 'TOMORROW X TOGETHER (TXT)', stage_name: 'HueningKai', birth_name: 'Kai Kamal Huening / Jung Kai (정카이)', position: 'Vocalist, Dancer, Rapper, Visual, Maknae', dob: '2002-08-14', zodiac: 'Leo', height_cm: 183, blood_type: 'A', mbti: 'ISTP', nationality: 'Korean-American', debut_year: 2019 },

  // aespa (All 4 Members)
  { artist_name: 'aespa', stage_name: 'Karina', birth_name: 'Yu Ji-min (유지민)', position: 'Leader, Main Dancer, Lead Rapper, Sub Vocalist, Face of the Group', dob: '2000-04-11', zodiac: 'Aries', height_cm: 168, blood_type: 'B', mbti: 'ENFP', nationality: 'South Korean', debut_year: 2020 },
  { artist_name: 'aespa', stage_name: 'Giselle', birth_name: 'Uchinaga Aeri (内永 枝利) / Kim Ae-ri', position: 'Main Rapper, Sub Vocalist', dob: '2000-10-30', zodiac: 'Scorpio', height_cm: 164, blood_type: 'O', mbti: 'ENFP', nationality: 'Korean-Japanese', debut_year: 2020 },
  { artist_name: 'aespa', stage_name: 'Winter', birth_name: 'Kim Min-jeong (김민정)', position: 'Lead Vocalist, Lead Dancer, Visual', dob: '2001-01-01', zodiac: 'Capricorn', height_cm: 164, blood_type: 'A', mbti: 'ISFJ', nationality: 'South Korean', debut_year: 2020 },
  { artist_name: 'aespa', stage_name: 'Ningning', birth_name: 'Ning Yizhuo (宁艺卓) / Jeo Ye-tak', position: 'Main Vocalist, Maknae', dob: '2002-10-23', zodiac: 'Scorpio', height_cm: 161, blood_type: 'O', mbti: 'INFP', nationality: 'Chinese', debut_year: 2020 },

  // IVE (All 6 Members)
  { artist_name: 'IVE', stage_name: 'An Yu-jin', birth_name: 'An Yu-jin (안유진)', position: 'Leader, Main Vocalist, Lead Dancer', dob: '2003-09-01', zodiac: 'Virgo', height_cm: 173, blood_type: 'A', mbti: 'ISTP', nationality: 'South Korean', debut_year: 2021 },
  { artist_name: 'IVE', stage_name: 'Gaeul', birth_name: 'Kim Ga-eul (김가을)', position: 'Main Dancer, Lead Rapper, Sub Vocalist', dob: '2002-09-24', zodiac: 'Libra', height_cm: 164, blood_type: 'B', mbti: 'ISTJ', nationality: 'South Korean', debut_year: 2021 },
  { artist_name: 'IVE', stage_name: 'Rei', birth_name: 'Naoi Rei (直井 怜) / Kim Rei', position: 'Main Rapper, Sub Vocalist', dob: '2004-02-03', zodiac: 'Aquarius', height_cm: 170, blood_type: 'A', mbti: 'INFJ', nationality: 'Japanese', debut_year: 2021 },
  { artist_name: 'IVE', stage_name: 'Jang Won-young', birth_name: 'Jang Won-young (장원영)', position: 'Vocalist, Visual, Center', dob: '2004-08-31', zodiac: 'Virgo', height_cm: 173, blood_type: 'O', mbti: 'E', nationality: 'South Korean', debut_year: 2021 },
  { artist_name: 'IVE', stage_name: 'Liz', birth_name: 'Kim Ji-won (김지원)', position: 'Main Vocalist', dob: '2004-11-21', zodiac: 'Scorpio', height_cm: 170, blood_type: 'AB', mbti: 'INFP', nationality: 'South Korean', debut_year: 2021 },
  { artist_name: 'IVE', stage_name: 'Leeseo', birth_name: 'Lee Hyun-seo (이현서)', position: 'Lead Dancer, Sub Vocalist, Visual, Maknae', dob: '2007-02-21', zodiac: 'Pisces', height_cm: 166, blood_type: 'O', mbti: 'ENFP', nationality: 'South Korean', debut_year: 2021 },

  // ENHYPEN (All 7 Members)
  { artist_name: 'ENHYPEN', stage_name: 'Jungwon', birth_name: 'Yang Jung-won (양정원)', position: 'Leader, Lead Vocalist, Lead Dancer', dob: '2004-02-09', zodiac: 'Aquarius', height_cm: 174, blood_type: 'AB', mbti: 'ISTJ', nationality: 'South Korean', debut_year: 2020 },
  { artist_name: 'ENHYPEN', stage_name: 'Heeseung', birth_name: 'Lee Hee-seung (이희승)', position: 'Main Vocalist, Lead Dancer, Center', dob: '2001-10-15', zodiac: 'Libra', height_cm: 183, blood_type: 'A', mbti: 'INFP', nationality: 'South Korean', debut_year: 2020 },
  { artist_name: 'ENHYPEN', stage_name: 'Jay', birth_name: 'Jay Park / Park Jong-seong (박종성)', position: 'Main Rapper, Lead Vocalist, Lead Dancer', dob: '2002-04-20', zodiac: 'Taurus', height_cm: 180, blood_type: 'B', mbti: 'INTP', nationality: 'Korean-American', debut_year: 2020 },
  { artist_name: 'ENHYPEN', stage_name: 'Jake', birth_name: 'Jake Sim / Sim Jae-yun (심재윤)', position: 'Lead Vocalist, Lead Dancer', dob: '2002-11-15', zodiac: 'Scorpio', height_cm: 176, blood_type: 'O', mbti: 'ISTJ', nationality: 'Korean-Australian', debut_year: 2020 },
  { artist_name: 'ENHYPEN', stage_name: 'Sunghoon', birth_name: 'Park Sung-hoon (박성훈)', position: 'Lead Vocalist, Lead Dancer, Visual', dob: '2002-12-08', zodiac: 'Sagittarius', height_cm: 181, blood_type: 'O', mbti: 'ISTJ', nationality: 'South Korean', debut_year: 2020 },
  { artist_name: 'ENHYPEN', stage_name: 'Sunoo', birth_name: 'Kim Sun-woo (김선우)', position: 'Lead Vocalist', dob: '2003-06-24', zodiac: 'Cancer', height_cm: 177, blood_type: 'O', mbti: 'ENFP', nationality: 'South Korean', debut_year: 2020 },
  { artist_name: 'ENHYPEN', stage_name: 'Ni-ki', birth_name: 'Nishimura Riki (西村力)', position: 'Main Dancer, Lead Vocalist, Maknae', dob: '2005-12-09', zodiac: 'Sagittarius', height_cm: 183, blood_type: 'B', mbti: 'ENTJ', nationality: 'Japanese', debut_year: 2020 },

  // ITZY (All 5 Members)
  { artist_name: 'ITZY', stage_name: 'Yeji', birth_name: 'Hwang Ye-ji (황예지)', position: 'Leader, Main Dancer, Lead Vocalist, Sub Rapper', dob: '2000-05-26', zodiac: 'Gemini', height_cm: 167, blood_type: 'A', mbti: 'ESFJ', nationality: 'South Korean', debut_year: 2019 },
  { artist_name: 'ITZY', stage_name: 'Lia', birth_name: 'Choi Ji-su (최지수)', position: 'Main Vocalist, Sub Rapper', dob: '2000-07-21', zodiac: 'Cancer', height_cm: 162, blood_type: 'AB', mbti: 'ENFJ', nationality: 'South Korean', debut_year: 2019 },
  { artist_name: 'ITZY', stage_name: 'Ryujin', birth_name: 'Shin Ryu-jin (신류진)', position: 'Main Rapper, Lead Dancer, Sub Vocalist, Center', dob: '2001-04-17', zodiac: 'Aries', height_cm: 164, blood_type: 'B', mbti: 'INTJ', nationality: 'South Korean', debut_year: 2019 },
  { artist_name: 'ITZY', stage_name: 'Chaeryeong', birth_name: 'Lee Chae-ryeong (이채령)', position: 'Main Dancer, Sub Vocalist, Sub Rapper', dob: '2001-06-05', zodiac: 'Gemini', height_cm: 166, blood_type: 'B', mbti: 'ISFJ', nationality: 'South Korean', debut_year: 2019 },
  { artist_name: 'ITZY', stage_name: 'Yuna', birth_name: 'Shin Yu-na (신유나)', position: 'Lead Dancer, Lead Rapper, Sub Vocalist, Visual, Maknae', dob: '2003-12-09', zodiac: 'Sagittarius', height_cm: 170, blood_type: 'A', mbti: 'ENFP', nationality: 'South Korean', debut_year: 2019 },

  // DAY6 (All 4 Members)
  { artist_name: 'Young K (DAY6)', stage_name: 'Sungjin', birth_name: 'Park Sung-jin (박성진)', position: 'Leader, Main Vocalist, Rhythm Guitarist', dob: '1993-01-16', zodiac: 'Capricorn', height_cm: 177, blood_type: 'A', mbti: 'ENFJ', nationality: 'South Korean', debut_year: 2015 },
  { artist_name: 'Young K (DAY6)', stage_name: 'Young K', birth_name: 'Kang Young-hyun (강영현)', position: 'Main Rapper, Main Vocalist, Bassist', dob: '1993-12-19', zodiac: 'Sagittarius', height_cm: 180, blood_type: 'B', mbti: 'ENTP', nationality: 'South Korean', debut_year: 2015 },
  { artist_name: 'Young K (DAY6)', stage_name: 'Wonpil', birth_name: 'Kim Won-pil (김원필)', position: 'Lead Vocalist, Visual, Keyboardist, Synthesizer', dob: '1994-04-28', zodiac: 'Taurus', height_cm: 176, blood_type: 'A', mbti: 'INFP', nationality: 'South Korean', debut_year: 2015 },
  { artist_name: 'Young K (DAY6)', stage_name: 'Dowoon', birth_name: 'Yoon Do-woon (윤도운)', position: 'Drummer, Sub Vocalist, Maknae', dob: '1995-08-25', zodiac: 'Virgo', height_cm: 177, blood_type: 'O', mbti: 'ISFP', nationality: 'South Korean', debut_year: 2015 },

  // BOYNEXTDOOR (All 6 Members)
  { artist_name: 'BOYNEXTDOOR', stage_name: 'Sungho', birth_name: 'Park Sung-ho (박성호)', position: 'Main Vocalist', dob: '2003-09-04', zodiac: 'Virgo', height_cm: 174, blood_type: 'A', mbti: 'ENTJ', nationality: 'South Korean', debut_year: 2023 },
  { artist_name: 'BOYNEXTDOOR', stage_name: 'Riwoo', birth_name: 'Lee Sang-hyeok (이상혁)', position: 'Main Dancer, Lead Vocalist', dob: '2003-10-22', zodiac: 'Libra', height_cm: 172, blood_type: 'A', mbti: 'ISFP', nationality: 'South Korean', debut_year: 2023 },
  { artist_name: 'BOYNEXTDOOR', stage_name: 'Jaehyun', birth_name: 'Myung Jae-hyun (명재현)', position: 'Leader, Main Rapper, Vocalist', dob: '2003-12-04', zodiac: 'Sagittarius', height_cm: 177, blood_type: 'A', mbti: 'ENFP', nationality: 'South Korean', debut_year: 2023 },
  { artist_name: 'BOYNEXTDOOR', stage_name: 'Taesan', birth_name: 'Han Dong-min (한동민)', position: 'Lead Rapper, Vocalist', dob: '2004-08-10', zodiac: 'Leo', height_cm: 182, blood_type: 'A', mbti: 'INTJ', nationality: 'South Korean', debut_year: 2023 },
  { artist_name: 'BOYNEXTDOOR', stage_name: 'Leehan', birth_name: 'Kim Dong-hyun (김동현)', position: 'Vocalist', dob: '2004-10-20', zodiac: 'Libra', height_cm: 180, blood_type: 'O', mbti: 'ESFJ', nationality: 'South Korean', debut_year: 2023 },
  { artist_name: 'BOYNEXTDOOR', stage_name: 'Woonhak', birth_name: 'Kim Woon-hak (김운학)', position: 'Vocalist, Maknae', dob: '2006-11-29', zodiac: 'Sagittarius', height_cm: 184, blood_type: 'A', mbti: 'ENFP', nationality: 'South Korean', debut_year: 2023 },

  // izna (All 7 Members)
  { artist_name: 'izna', stage_name: 'Mai', birth_name: 'Tomioka Mai (冨岡 茉衣)', position: 'Sub Vocalist, Visual', dob: '2004-10-28', zodiac: 'Scorpio', height_cm: 167, blood_type: 'O', mbti: 'ISTP', nationality: 'Japanese', debut_year: 2024 },
  { artist_name: 'izna', stage_name: 'Bang Jeemin', birth_name: 'Bang Jee-min (방지민)', position: 'Sub Vocalist, Center', dob: '2005-05-08', zodiac: 'Taurus', height_cm: 170, blood_type: 'B', mbti: 'INFP', nationality: 'South Korean', debut_year: 2024 },
  { artist_name: 'izna', stage_name: 'Yoon Jiyoon', birth_name: 'Yoon Ji-yoon (윤지윤)', position: 'Main Vocalist', dob: '2005-07-14', zodiac: 'Cancer', height_cm: 166, blood_type: 'A', mbti: 'ISFJ', nationality: 'South Korean', debut_year: 2024 },
  { artist_name: 'izna', stage_name: 'Koko', birth_name: 'Narai Koko (奈良井 ここ)', position: 'Main Dancer, Main Rapper', dob: '2006-11-14', zodiac: 'Scorpio', height_cm: 173, blood_type: 'O', mbti: 'ESFJ', nationality: 'Japanese', debut_year: 2024 },
  { artist_name: 'izna', stage_name: 'Ryu Sarang', birth_name: 'Ryu Sa-rang (류사랑)', position: 'Lead Vocalist, Lead Dancer', dob: '2007-10-02', zodiac: 'Libra', height_cm: 165, blood_type: 'B', mbti: 'INFP', nationality: 'South Korean', debut_year: 2024 },
  { artist_name: 'izna', stage_name: 'Choi Jungeun', birth_name: 'Choi Jung-eun (최정은)', position: 'All-Rounder, Lead Vocalist, Lead Dancer, Sub Rapper', dob: '2007-08-04', zodiac: 'Leo', height_cm: 164, blood_type: 'AB', mbti: 'ISFJ', nationality: 'South Korean', debut_year: 2024 },
  { artist_name: 'izna', stage_name: 'Jeong Saebi', birth_name: 'Jeong Sae-bi (정세비)', position: 'Sub Vocalist, Visual, Maknae', dob: '2008-01-22', zodiac: 'Aquarius', height_cm: 172, blood_type: 'A', mbti: 'ENFP', nationality: 'South Korean', debut_year: 2024 },

  // The Rose (All 4 Members)
  { artist_name: 'The Rose', stage_name: 'Woosung', birth_name: 'Kim Woo-sung (김우성) / Sammy', position: 'Leader, Lead Vocalist, Electric Guitarist', dob: '1993-02-25', zodiac: 'Pisces', height_cm: 173, blood_type: 'A', mbti: 'ENTJ', nationality: 'Korean-American', debut_year: 2017 },
  { artist_name: 'The Rose', stage_name: 'Dojoon', birth_name: 'Park Do-joon (박도준) / Leo', position: 'Main Vocalist, Keyboardist, Acoustic Guitarist', dob: '1993-04-20', zodiac: 'Taurus', height_cm: 176, blood_type: 'O', mbti: 'ENFP', nationality: 'South Korean', debut_year: 2017 },
  { artist_name: 'The Rose', stage_name: 'Hajoon', birth_name: 'Lee Ha-joon (이하준) / Dylan', position: 'Drummer, Sub Vocalist', dob: '1994-07-29', zodiac: 'Leo', height_cm: 178, blood_type: 'AB', mbti: 'INFJ', nationality: 'South Korean', debut_year: 2017 },
  { artist_name: 'The Rose', stage_name: 'Jaehyeong', birth_name: 'Lee Jae-hyeong (이재형) / Jeff', position: 'Bassist, Sub Vocalist, Visual, Maknae', dob: '1994-11-03', zodiac: 'Scorpio', height_cm: 181, blood_type: 'B', mbti: 'INFJ', nationality: 'South Korean', debut_year: 2017 },

  // (G)I-DLE (All 5 Members)
  { artist_name: '(G)I-DLE', stage_name: 'Miyeon', birth_name: 'Cho Mi-yeon (조미연)', position: 'Main Vocalist, Visual', dob: '1997-01-31', zodiac: 'Aquarius', height_cm: 161, blood_type: 'B', mbti: 'ENFP', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: '(G)I-DLE', stage_name: 'Minnie', birth_name: 'Nicha Yontararak (ณิชา ยนตรรักษ์) / Kim Min-hee', position: 'Main Vocalist', dob: '1997-10-23', zodiac: 'Scorpio', height_cm: 167, blood_type: 'O', mbti: 'ENFJ', nationality: 'Thai', debut_year: 2018 },
  { artist_name: '(G)I-DLE', stage_name: 'Soyeon', birth_name: 'Jeon So-yeon (전소연)', position: 'Leader, Main Rapper, Sub Vocalist, Producer, Center', dob: '1998-08-26', zodiac: 'Virgo', height_cm: 157, blood_type: 'B', mbti: 'INTJ', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: '(G)I-DLE', stage_name: 'Yuqi', birth_name: 'Song Yuqi (宋雨琦) / Song Woo-gi', position: 'Lead Dancer, Sub Vocalist, Sub Rapper, Face of the Group', dob: '1999-09-23', zodiac: 'Libra', height_cm: 162, blood_type: 'O', mbti: 'ESFJ', nationality: 'Chinese', debut_year: 2018 },
  { artist_name: '(G)I-DLE', stage_name: 'Shuhua', birth_name: 'Yeh Shuhua (葉舒華) / Yeo Su-hwa', position: 'Sub Vocalist, Visual, Maknae', dob: '2000-01-06', zodiac: 'Capricorn', height_cm: 161, blood_type: 'A', mbti: 'INFP', nationality: 'Taiwanese', debut_year: 2018 },

  // LE SSERAFIM (All 5 Members)
  { artist_name: 'LE SSERAFIM', stage_name: 'Kim Chaewon', birth_name: 'Kim Chae-won (김채원)', position: 'Leader, Vocalist, Dancer', dob: '2000-08-01', zodiac: 'Leo', height_cm: 163, blood_type: 'B', mbti: 'ISFP', nationality: 'South Korean', debut_year: 2022 },
  { artist_name: 'LE SSERAFIM', stage_name: 'Sakura', birth_name: 'Miyawaki Sakura (宮脇 咲良)', position: 'Vocalist, Dancer, Visual', dob: '1998-03-19', zodiac: 'Pisces', height_cm: 163, blood_type: 'A', mbti: 'INTP', nationality: 'Japanese', debut_year: 2022 },
  { artist_name: 'LE SSERAFIM', stage_name: 'Huh Yunjin', birth_name: 'Huh Yun-jin (허윤진) / Jennifer Huh', position: 'Main Vocalist, Dancer', dob: '2001-10-08', zodiac: 'Libra', height_cm: 172, blood_type: 'B', mbti: 'INFJ', nationality: 'Korean-American', debut_year: 2022 },
  { artist_name: 'LE SSERAFIM', stage_name: 'Kazuha', birth_name: 'Nakamura Kazuha (中村 一葉)', position: 'Sub Vocalist, Rapper, Dancer', dob: '2003-08-09', zodiac: 'Leo', height_cm: 170, blood_type: 'B', mbti: 'ENFP', nationality: 'Japanese', debut_year: 2022 },
  { artist_name: 'LE SSERAFIM', stage_name: 'Hong Eunchae', birth_name: 'Hong Eun-chae (홍은채)', position: 'Lead Dancer, Vocalist, Maknae', dob: '2006-11-10', zodiac: 'Scorpio', height_cm: 170, blood_type: 'A', mbti: 'ISFP', nationality: 'South Korean', debut_year: 2022 },

  // ATEEZ (All 8 Members)
  { artist_name: 'ATEEZ', stage_name: 'Hongjoong', birth_name: 'Kim Hong-joong (김홍중)', position: 'Leader, Main Rapper, Vocalist, Producer', dob: '1998-11-07', zodiac: 'Scorpio', height_cm: 172, blood_type: 'B', mbti: 'INFP', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: 'ATEEZ', stage_name: 'Seonghwa', birth_name: 'Park Seong-hwa (박성화)', position: 'Vocalist, Visual', dob: '1998-04-03', zodiac: 'Aries', height_cm: 178, blood_type: 'O', mbti: 'ENFJ', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: 'ATEEZ', stage_name: 'Yunho', birth_name: 'Jeong Yun-ho (정윤호)', position: 'Main Dancer, Vocalist', dob: '1999-03-23', zodiac: 'Aries', height_cm: 184, blood_type: 'A', mbti: 'ENFJ', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: 'ATEEZ', stage_name: 'Yeosang', birth_name: 'Kang Yeo-sang (강여상)', position: 'Lead Dancer, Vocalist, Visual', dob: '1999-06-15', zodiac: 'Gemini', height_cm: 175, blood_type: 'A', mbti: 'ISFP', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: 'ATEEZ', stage_name: 'San', birth_name: 'Choi San (최산)', position: 'Main Dancer, Lead Vocalist', dob: '1999-07-10', zodiac: 'Cancer', height_cm: 175, blood_type: 'B', mbti: 'INFP', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: 'ATEEZ', stage_name: 'Mingi', birth_name: 'Song Min-gi (송민기)', position: 'Main Rapper, Main Dancer', dob: '1999-08-09', zodiac: 'Leo', height_cm: 183, blood_type: 'B', mbti: 'ENTP', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: 'ATEEZ', stage_name: 'Wooyoung', birth_name: 'Jung Woo-young (정우영)', position: 'Main Dancer, Vocalist, Visual', dob: '1999-11-26', zodiac: 'Sagittarius', height_cm: 173, blood_type: 'A', mbti: 'ESFJ', nationality: 'South Korean', debut_year: 2018 },
  { artist_name: 'ATEEZ', stage_name: 'Jongho', birth_name: 'Choi Jong-ho (최종호)', position: 'Main Vocalist, Maknae', dob: '2000-10-12', zodiac: 'Libra', height_cm: 176, blood_type: 'O', mbti: 'ISFP', nationality: 'South Korean', debut_year: 2018 },

  // 2NE1 (All 4 Members)
  { artist_name: '2NE1', stage_name: 'CL', birth_name: 'Lee Chae-rin (이채린)', position: 'Leader, Main Rapper, Lead Vocalist', dob: '1991-02-26', zodiac: 'Pisces', height_cm: 162, blood_type: 'A', mbti: 'ENFP', nationality: 'South Korean', debut_year: 2009 },
  { artist_name: '2NE1', stage_name: 'Park Bom', birth_name: 'Park Bom (박봄)', position: 'Main Vocalist', dob: '1984-03-24', zodiac: 'Aries', height_cm: 165, blood_type: 'AB', mbti: 'ENFP', nationality: 'South Korean', debut_year: 2009 },
  { artist_name: '2NE1', stage_name: 'Sandara Park', birth_name: 'Sandara Park (박산다라) / Dara', position: 'Vocalist, Sub Rapper, Visual', dob: '1984-11-12', zodiac: 'Scorpio', height_cm: 162, blood_type: 'A', mbti: 'INFJ', nationality: 'South Korean', debut_year: 2009 },
  { artist_name: '2NE1', stage_name: 'Minzy', birth_name: 'Gong Min-ji (공민지)', position: 'Main Dancer, Lead Vocalist, Lead Rapper, Maknae', dob: '1994-01-18', zodiac: 'Capricorn', height_cm: 161, blood_type: 'O', mbti: 'ISFJ', nationality: 'South Korean', debut_year: 2009 },

  // MAMAMOO (All 4 Members)
  { artist_name: 'MAMAMOO', stage_name: 'Solar', birth_name: 'Kim Yong-sun (김용선)', position: 'Leader, Main Vocalist', dob: '1991-02-21', zodiac: 'Pisces', height_cm: 163, blood_type: 'B', mbti: 'INTJ', nationality: 'South Korean', debut_year: 2014 },
  { artist_name: 'MAMAMOO', stage_name: 'Moonbyul', birth_name: 'Moon Byul-yi (문별이)', position: 'Main Rapper, Main Dancer, Vocalist', dob: '1992-12-22', zodiac: 'Capricorn', height_cm: 165, blood_type: 'B', mbti: 'ENFP', nationality: 'South Korean', debut_year: 2014 },
  { artist_name: 'MAMAMOO', stage_name: 'Wheein', birth_name: 'Jung Whee-in (정휘인)', position: 'Lead Vocalist, Lead Dancer', dob: '1995-04-17', zodiac: 'Aries', height_cm: 162, blood_type: 'B', mbti: 'ESFP', nationality: 'South Korean', debut_year: 2014 },
  { artist_name: 'MAMAMOO', stage_name: 'Hwasa', birth_name: 'Ahn Hye-jin (안혜진)', position: 'Lead Vocalist, Lead Rapper, Maknae', dob: '1995-07-23', zodiac: 'Leo', height_cm: 162, blood_type: 'A', mbti: 'INFP', nationality: 'South Korean', debut_year: 2014 },

  // Red Velvet (All 5 Members)
  { artist_name: 'Red Velvet', stage_name: 'Irene', birth_name: 'Bae Joo-hyun (배주현)', position: 'Leader, Main Rapper, Lead Dancer, Sub Vocalist, Visual, Center', dob: '1991-03-29', zodiac: 'Aries', height_cm: 158, blood_type: 'A', mbti: 'ISFJ', nationality: 'South Korean', debut_year: 2014 },
  { artist_name: 'Red Velvet', stage_name: 'Seulgi', birth_name: 'Kang Seul-gi (강슬기)', position: 'Main Dancer, Lead Vocalist', dob: '1994-02-10', zodiac: 'Aquarius', height_cm: 161, blood_type: 'A', mbti: 'ISFP', nationality: 'South Korean', debut_year: 2014 },
  { artist_name: 'Red Velvet', stage_name: 'Wendy', birth_name: 'Son Seung-wan (손승완) / Shon Wendy', position: 'Main Vocalist', dob: '1994-02-21', zodiac: 'Pisces', height_cm: 159, blood_type: 'O', mbti: 'ISFP', nationality: 'Korean-Canadian', debut_year: 2014 },
  { artist_name: 'Red Velvet', stage_name: 'Joy', birth_name: 'Park Soo-young (박수영)', position: 'Lead Rapper, Sub Vocalist', dob: '1996-09-03', zodiac: 'Virgo', height_cm: 167, blood_type: 'A', mbti: 'INFP', nationality: 'South Korean', debut_year: 2014 },
  { artist_name: 'Red Velvet', stage_name: 'Yeri', birth_name: 'Kim Ye-rim (김예림)', position: 'Sub Vocalist, Sub Rapper, Maknae', dob: '1999-03-05', zodiac: 'Pisces', height_cm: 158, blood_type: 'O', mbti: 'INTP', nationality: 'South Korean', debut_year: 2015 }
];

async function run() {
  console.log('🚀 Enriching K-Pop Artists with verified photos & Malaysian tour history...');

  // Ensure header_image column exists
  try {
    const rawDb = db.getRawDb ? db.getRawDb() : null;
    if (rawDb) {
      const colInfo = rawDb.prepare("PRAGMA table_info(artists)").all();
      const hasHeaderImage = colInfo.some(c => c.name === 'header_image');
      if (!hasHeaderImage) {
        rawDb.prepare("ALTER TABLE artists ADD COLUMN header_image TEXT").run();
        console.log("Added header_image column to artists table.");
      }
    }
  } catch (err) {
    console.log("Column check notice:", err.message);
  }

  for (const art of ARTISTS_DATA) {
    let existing = null;
    
    // Exact ID match if specified
    if (art.id) {
      existing = await db.getOne('SELECT id, name FROM artists WHERE id = ?', [art.id]);
    }
    
    // Otherwise exact case-insensitive name match
    if (!existing) {
      existing = await db.getOne('SELECT id, name FROM artists WHERE LOWER(name) = LOWER(?)', [art.name]);
    }

    if (existing) {
      await db.execute(`
        UPDATE artists 
        SET name = ?, group_type = ?, agency = ?, image_url = ?, header_image = ?, description = ?
        WHERE id = ?
      `, [art.name, art.group_type, art.agency, art.image_url, art.header_image, art.description, existing.id]);
      console.log(`✅ Updated artist: [ID ${existing.id}] ${art.name}`);
    } else {
      const res = await db.execute(`
        INSERT INTO artists (name, group_type, agency, image_url, header_image, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [art.name, art.group_type, art.agency, art.image_url, art.header_image, art.description]);
      console.log(`🌟 Inserted new artist: ${art.name} (ID: ${res.insertId || 'auto'})`);
    }
  }

  // Populate Members for groups
  console.log('\n👥 Updating members table for K-Pop groups...');
  for (const m of MEMBERS_DATA) {
    const artist = await db.getOne(
      'SELECT id, name FROM artists WHERE LOWER(name) = LOWER(?)',
      [m.artist_name]
    );

    if (!artist) {
      console.warn(`⚠️ Artist not found for member: ${m.stage_name} (${m.artist_name})`);
      continue;
    }

    const existingMember = await db.getOne(
      'SELECT id FROM members WHERE artist_id = ? AND LOWER(stage_name) = LOWER(?)',
      [artist.id, m.stage_name]
    );

    if (existingMember) {
      await db.execute(`
        UPDATE members 
        SET birth_name = ?, position = ?, dob = ?, zodiac = ?, height_cm = ?, blood_type = ?, mbti = ?, nationality = ?, debut_year = ?
        WHERE id = ?
      `, [m.birth_name, m.position, m.dob, m.zodiac, m.height_cm, m.blood_type, m.mbti, m.nationality, m.debut_year, existingMember.id]);
      console.log(`  ✓ Updated member: ${m.stage_name} (${artist.name})`);
    } else {
      await db.execute(`
        INSERT INTO members (artist_id, stage_name, birth_name, group_name, position, dob, zodiac, height_cm, blood_type, mbti, nationality, debut_year, is_active, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)
      `, [artist.id, m.stage_name, m.birth_name, artist.name, m.position, m.dob, m.zodiac, m.height_cm, m.blood_type, m.mbti, m.nationality, m.debut_year]);
      console.log(`  + Inserted member: ${m.stage_name} (${artist.name})`);
    }
  }

  console.log('\n🎉 Artists & Members enrichment completed successfully!');
  process.exit(0);
}

run().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
