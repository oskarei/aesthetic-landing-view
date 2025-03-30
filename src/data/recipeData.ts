import { Recipe } from '@/types/recipe';
import { createRecipeSlug } from '@/lib/slugify';

// Generate random dates within the last 6 months
const getRandomDate = () => {
  const now = new Date();
  const monthsAgo = new Date();
  monthsAgo.setMonth(now.getMonth() - 6);
  
  const randomTime = monthsAgo.getTime() + Math.random() * (now.getTime() - monthsAgo.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
};

// Generate a list of 6 mock recipes
export const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Íslenski Lambakjöt með Rósmarín",
    author: "Jón Jónsson",
    date: getRandomDate(),
    tagline: "Ekta íslenskt lambakjöt með fersku rósmarín og hvítlauk",
    taxonomy: ["Kjöt", "Íslenskt", "Aðalréttur"],
    body: `
      ## Hráefni
      
      - 1 kg lambafillet
      - 3 greinar rósmarín
      - 4 hvítlauksrif
      - 2 msk ólífuolía
      - Salt og pipar eftir smekk
      
      ## Aðferð
      
      1. Hitið ofninn í 180°C.
      2. Blandið ólífuolíu, söxuðum hvítlauk og rósmarín í skál.
      3. Nuddið blöndunni á lambakjötið og kryddið með salti og pipar.
      4. Bakið í ofni í 25-30 mínútur eða þar til kjötið er eldað að ósk.
      5. Látið kjötið hvíla í 10 mínútur áður en það er skorið.
      
      Berið fram með soðnum kartöflum og ferskri salat.
    `,
    image: "/placeholder.svg",
    slug: "islenski-lambakjot-med-rosmarin"
  },
  {
    id: "2",
    title: "Skúffukaka að hætti mömmu",
    author: "Sigríður Magnúsdóttir",
    date: getRandomDate(),
    tagline: "Mjúk og safarík skúffukaka með súkkulaðikremi",
    taxonomy: ["Bakstur", "Eftirréttir", "Súkkulaði"],
    body: `
      ## Hráefni fyrir kökuna
      
      - 200 g hveiti
      - 250 g sykur
      - 3 egg
      - 150 g smjör
      - 2 msk kakó
      - 1 tsk vanilla extract
      - 1 tsk lyftiduft
      
      ## Hráefni fyrir kremið
      
      - 100 g smjör
      - 150 g flórsykur
      - 2 msk kakó
      - 2 msk kaffi
      
      ## Aðferð
      
      1. Hitið ofninn í 175°C.
      2. Blandið þurrefnunum saman í skál.
      3. Bætið smjöri, eggjum og vanillu við og hrærið vel.
      4. Hellið deiginu í smurt form og bakið í 25-30 mínútur.
      5. Á meðan kakan bakast, útbúið kremið með því að hræra saman öll hráefnin.
      6. Þegar kakan er bökuð, leyfið henni að kólna aðeins áður en kremið er sett ofan á.
      
      Berið fram með mjólk eða kaffi.
    `,
    image: "/placeholder.svg"
  },
  {
    id: "3",
    title: "Þorskhrogn með brúnuðu smjöri",
    author: "Guðrún Jónsdóttir",
    date: getRandomDate(),
    tagline: "Ljúffeng þorskhrogn með brúnuðu smjöri og söxuðu dilli",
    taxonomy: ["Fiskur", "Sjávarfang", "Aðalréttur"],
    body: `
      ## Hráefni
      
      - 500 g fersk þorskhrogn
      - 100 g smjör
      - 2 msk saxað dill
      - 1 sítróna
      - Salt og pipar eftir smekk
      
      ## Aðferð
      
      1. Skolið þorskhrogn undir köldu vatni og þerrið.
      2. Hitið pönnu og bætið við smjöri.
      3. Látið smjörið brúnast en passið að brenna það ekki.
      4. Setjið þorskhrogn á pönnuna og steikið í 2-3 mínútur á hvorri hlið.
      5. Bætið við söxuðu dilli og kreistið sítrónusafa yfir.
      6. Berið fram með soðnum kartöflum og fersku grænmeti.
      
      Fullkominn réttur fyrir sanna íslenska matarunnendur.
    `,
    image: "/placeholder.svg"
  },
  {
    id: "4",
    title: "Heimagerður Kleinur",
    author: "Ólafur Einarsson",
    date: getRandomDate(),
    tagline: "Klassískar íslenskar kleinur eins og amma þín gerði þær",
    taxonomy: ["Bakstur", "Hefðbundið", "Sætabrauð"],
    body: `
      ## Hráefni
      
      - 500 g hveiti
      - 150 g sykur
      - 2 egg
      - 125 g smjörlíki
      - 2 tsk hjartarsalt
      - 1 tsk kardemommudropar
      - 2 dl mjólk
      - Olía til steikingar
      
      ## Aðferð
      
      1. Blandið þurrefnunum saman í skál.
      2. Bræðið smjörlíkið og kælið lítillega.
      3. Bætið eggjum, smjörlíki, kardemommudropum og mjólk saman við og hnoðið deigið vel.
      4. Fletjið deigið út og skerið í kleinur.
      5. Skerið rauf í miðjuna og togið einn enda í gegnum raufina.
      6. Hitið olíu í potti og steikið kleinurnar þar til þær eru gylltar á lit.
      7. Takið upp úr olíunni og leggið á eldhúspappír til að ná olíunni af.
      
      Berið fram með heitu kakói eða kaffi.
    `,
    image: "/placeholder.svg"
  },
  {
    id: "5",
    title: "Fiskisúpa með saffran",
    author: "Helga Björnsdóttir",
    date: getRandomDate(),
    tagline: "Ljúffeng fiskisúpa með íslensku sjávarfangi og saffran",
    taxonomy: ["Súpur", "Fiskur", "Aðalréttur"],
    body: `
      ## Hráefni
      
      - 300 g þorskur
      - 200 g lax
      - 150 g rækjur
      - 1 laukur
      - 2 hvítlauksrif
      - 2 gulrætur
      - 1 blaðlaukur
      - 1 tsk saffran
      - 5 dl fiskisoð
      - 2 dl rjómi
      - Olía til steikingar
      - Salt og pipar eftir smekk
      
      ## Aðferð
      
      1. Skerið fiskinn í bita og hreinsið rækjurnar.
      2. Saxið lauk, hvítlauk, gulrætur og blaðlauk.
      3. Steikið grænmetið í olíu þar til laukurinn er glær.
      4. Bætið við fiskisoði og saffran og látið sjóða í 10 mínútur.
      5. Lækkið hitann og bætið við fiski og rækjum. Látið sjóða í 5 mínútur.
      6. Bætið rjóma við og látið sjóða áfram í 2-3 mínútur.
      
      Berið fram með nýbökuðu brauði og góðu smjöri.
    `,
    image: "/placeholder.svg"
  },
  {
    id: "6",
    title: "Rúgbrauð í potti",
    author: "Björn Þórsson",
    date: getRandomDate(),
    tagline: "Dökkt og safaríkt íslenskt rúgbrauð bakað í potti",
    taxonomy: ["Bakstur", "Brauð", "Hefðbundið"],
    body: `
      ## Hráefni
      
      - 500 g rúgmjöl
      - 250 g hveiti
      - 250 g púðursykur
      - 2 tsk salt
      - 4 tsk matarsódi
      - 1 l súrmjólk
      
      ## Aðferð
      
      1. Blandið öllum þurrefnum saman í stórri skál.
      2. Bætið súrmjólk við og hrærið vel.
      3. Smyrjið pott með smjöri eða olíu.
      4. Hellið deiginu í pottinn og lokið með álpappír og loki.
      5. Setjið pottinn í ofn við 100°C og bakið í 12 klukkutíma (yfir nótt).
      6. Takið rúgbrauðið úr pottinum þegar það hefur kólnað lítillega.
      
      Berið fram með góðu smjöri, hangikjöti eða reyktum laxi.
    `,
    image: "/placeholder.svg"
  }
];

// Add slugs to all recipes
mockRecipes.forEach(recipe => {
  if (!recipe.slug) {
    recipe.slug = createRecipeSlug(recipe.title);
  }
});

// Simulate API call with a delay
export const getRecipes = (): Promise<Recipe[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockRecipes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, 500);
  });
};

// Get more recipes for infinite scrolling (simulated pagination)
export const getMoreRecipes = (page: number): Promise<Recipe[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const moreRecipes = mockRecipes.map(recipe => ({
        ...recipe,
        id: `${recipe.id}-page-${page}`,
        title: `${recipe.title} (${page})`,
        slug: `${recipe.slug}-page-${page}`
      }));
      resolve(moreRecipes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, 500);
  });
};
