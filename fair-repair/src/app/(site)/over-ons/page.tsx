import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Over Ons',
    description: 'Lees meer over de missie en visie van Fair-repair.',
};

export default function AboutPage() {
    return (
        <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto py-8">
            {/* Optioneel: afbeelding bovenaan */}
            {/* <div className="relative aspect-[16/7] mb-8 not-prose">
        <Image src="/images/team-mission.jpg" alt="Fair-repair Missie" layout="fill" objectFit="cover" className="rounded-lg shadow-md" />
      </div> */}
            <h1>Over Fair-repair</h1>
            <p className="lead text-xl">
                Fair-repair is uw onafhankelijke, uitgebreide bron voor consumentenelektronica in de Benelux.
                Ons doel is om consumenten te voorzien van diepgaande, betrouwbare informatie met een sterke
                focus op repareerbaarheid, duurzaamheid en consumentenvoorlichting.
            </p>
            <h2>Onze Missie</h2>
            <p>
                Wij geloven in een toekomst waarin consumenten weloverwogen keuzes kunnen maken voor producten
                die niet alleen technologisch geavanceerd zijn, maar ook lang meegaan en eenvoudig te repareren zijn.
                We streven ernaar de "bewuste consument" te versterken door:
            </p>
            <ul>
                <li>Duidelijke en eerlijke productreviews met een unieke repareerbaarheidsscore.</li>
                <li>Stap-voor-stap reparatiegidsen om de levensduur van apparaten te verlengen.</li>
                <li>Vergelijkende "Top X" lijsten die repareerbaarheid en duurzaamheid benadrukken.</li>
                <li>Educatieve artikelen die complexe technische onderwerpen en EU-regelgeving toegankelijk maken.</li>
                <li>Actueel nieuws over consumentenrechten en de tech-industrie.</li>
            </ul>
            <h2>Onze Visie</h2>
            <p>
                We zien een circulaire economie voor consumentenelektronica voor ons, waarin reparatie de norm is en e-waste drastisch wordt verminderd. Fair-repair wil een katalysator zijn in deze transitie door kennis te delen en consumenten te empoweren.
            </p>
            <h2>Het Team</h2>
            <p>
                Fair-repair wordt gerund door een gepassioneerd team van tech-enthousiastelingen, reparatie-experts en voorvechters van consumentenrechten. (Voeg hier eventueel meer details toe).
            </p>
        </div>
    );
}