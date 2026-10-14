import type { Teacher } from '@/types';

const githubImage = (folder: string, file: string): string =>
  `https://raw.githubusercontent.com/fozilovamaftuna26/Hashim-School/main/img/${folder}/${file}`;

export const GITHUB_TEACHERS: Teacher[] = [
  {
    id: 'github-baxodir-karimov',
    full_name: 'Baxodir Karimov',
    specialty: 'Robototexnika ustozi',
    bio: "5 yillik tajriba, bir nechta xalqaro olimpiada g'oliblarini tayyorlagan.",
    photo_url: githubImage('Ustozlar', '2.jpg'),
    experience_years: 5,
    display_order: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'github-ism-familiya',
    full_name: 'Ism Familiya',
    specialty: 'Robototexnika ustozi',
    bio: "5 yillik tajriba, bir nechta xalqaro olimpiada g'oliblarini tayyorlagan.",
    photo_url: githubImage('Ustozlar', '2.jpg'),
    experience_years: 5,
    display_order: 2,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'github-maftuna-muqimjonova',
    full_name: 'Maftuna Muqimjonova',
    specialty: 'Dasturlash ustozi',
    bio: "Python va mBot 2 yo'nalishlari bo'yicha mutaxassis.",
    photo_url: githubImage('Ustozlar', '3.jpg'),
    experience_years: 5,
    display_order: 3,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'github-azizbek-omonov',
    full_name: 'Azizbek Omonov',
    specialty: 'Amaliy loyihalash ustozi',
    bio: "Amaliy loyihalar va 3D modellashtirish bo'yicha murabbiy.",
    photo_url: githubImage('Ustozlar', '4.jpg'),
    experience_years: 5,
    display_order: 4,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'github-nozimaxon-qosimova',
    full_name: 'Nozimaxon Qosimova',
    specialty: 'WeDo ustozi',
    bio: "Yosh o'quvchilarga zamonaviy texnologiyalarni sodda tilda o'rgatadi.",
    photo_url: githubImage('Ustozlar', '1.jpg'),
    experience_years: 5,
    display_order: 5,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'github-mohinur-hamidova',
    full_name: 'Mohinur Hamidova',
    specialty: 'Arduino ustozi',
    bio: "Texnologiya fani magistranti va Arduino yo'nalishi bo'yicha mutaxassis.",
    photo_url: githubImage('Ustozlar', '5.jpg'),
    experience_years: 5,
    display_order: 6,
    created_at: '',
    updated_at: '',
  },
];

export const GITHUB_GRADUATE_IMAGES: string[] = Array.from(
  { length: 126 },
  (_, index) => githubImage('Bitiruvchilar', `${index + 1}.jpg`),
);

export const GITHUB_GRADUATE_ROWS: string[][] = [
  GITHUB_GRADUATE_IMAGES.slice(0, 42),
  GITHUB_GRADUATE_IMAGES.slice(42, 84),
  GITHUB_GRADUATE_IMAGES.slice(84, 126),
];
