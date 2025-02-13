# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```
SUPABASE DATENBANKTABELLEN:
create table
  public.durchsicht (
    id serial not null,
    fin character varying not null,
    datum date not null,
    km integer not null,
    anmerkungen text null,
    constraint durchsicht_pkey primary key (id),
    constraint durchsicht_fin_fkey foreign key (fin) references fahrzeuge (fin) on delete cascade
  ) tablespace pg_default;

  create table
  public.fahrzeug_kosten (
    id serial not null,
    fahrzeug_fin character varying not null,
    datum date not null,
    kategorie character varying not null,
    beschreibung character varying not null,
    betrag numeric not null,
    beleg_nr character varying null,
    constraint fahrzeug_kosten_pkey primary key (id)
  ) tablespace pg_default;

  create table
  public.fahrzeug_reparaturen (
    id serial not null,
    fahrzeug_fin character varying not null,
    datum date not null,
    beschreibung character varying not null,
    kilometerstand integer not null,
    kosten numeric not null,
    status character varying not null,
    constraint fahrzeug_reparaturen_pkey primary key (id),
    constraint fahrzeug_reparaturen_status_check check (
      (
        (status)::text = any (
          array[
            ('offen'::character varying)::text,
            ('abgeschlossen'::character varying)::text
          ]
        )
      )
    )
  ) tablespace pg_default;

create table
  public.fahrzeug_schaeden (
    id serial not null,
    fin character varying not null,
    beschreibung text not null,
    schadensart character varying(255) not null,
    fahrer character varying(255) not null,
    eigenverschulden boolean not null,
    gemeldet boolean not null,
    hoehe_des_schadens numeric(10, 2) not null,
    created_at timestamp without time zone null default current_timestamp,
    constraint fahrzeug_schaeden_pkey primary key (id)
  ) tablespace pg_default;

  create table
  public.fahrzeug_versicherungen (
    id serial not null,
    fahrzeug_fin character varying not null,
    versicherung_id integer not null,
    gueltig_von date not null,
    gueltig_bis date null,
    constraint fahrzeug_versicherungen_pkey primary key (id),
    constraint fahrzeug_versicherungen_versicherung_id_fkey foreign key (versicherung_id) references versicherungen (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.fahrzeug_wartungen (
    id serial not null,
    fahrzeug_fin character varying not null,
    datum date not null,
    beschreibung character varying not null,
    kilometerstand integer not null,
    kosten numeric not null,
    naechste_wartung date null,
    constraint fahrzeug_wartungen_pkey primary key (id)
  ) tablespace pg_default;

  create table
  public.fahrzeuge (
    kennzeichen character varying(20) not null,
    marke character varying(50) null,
    modell character varying(50) not null,
    typschluessel_nr character varying(50) null,
    karosserie_typ character varying(50) null,
    kraftstoff_typ character varying(20) null,
    leistung_ps integer null,
    kaufpreis numeric null,
    bruttolistenpreis numeric null,
    kaufdatum date null,
    erstzulassung date null,
    breite double precision null,
    laenge double precision null,
    hoehe double precision null,
    leermasse double precision null,
    gesamtmasse double precision null,
    max_zuladung double precision null,
    anhaengerkupplung boolean null,
    sitze integer null,
    kilometerstand integer null,
    garantie date null,
    versicherungs_nr character varying(50) null,
    schaden boolean null,
    fin character varying not null,
    versicherungs_id integer null,
    constraint fahrzeuge_pkey primary key (fin),
    constraint fahrzeuge_versicherungs_id_fkey foreign key (versicherungs_id) references versicherungen (id) on delete set null
  ) tablespace pg_default;

create trigger log_queries_trigger
after insert
or delete
or
update on fahrzeuge for each row
execute function log_queries ();

create table
  public.versicherung_fahrzeuge (
    id serial not null,
    versicherung_id integer not null,
    fahrzeug_fin text not null,
    constraint versicherung_fahrzeuge_pkey primary key (id),
    constraint versicherung_fahrzeuge_versicherung_id_fahrzeug_fin_key unique (versicherung_id, fahrzeug_fin),
    constraint versicherung_fahrzeuge_versicherung_id_fkey foreign key (versicherung_id) references versicherungen (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.versicherung_zusatzleistungen (
    id serial not null,
    versicherung_id integer not null,
    zusatzid integer not null,
    gueltig_von date not null,
    gueltig_bis date not null,
    created_at timestamp without time zone null default current_timestamp,
    constraint versicherung_zusatzleistungen_pkey primary key (id),
    constraint versicherung_zusatzleistungen_versicherung_id_fkey foreign key (versicherung_id) references versicherungen (id) on delete cascade,
    constraint versicherung_zusatzleistungen_zusatzid_fkey foreign key (zusatzid) references zusatzleistungen (zusatzid) on delete cascade
  ) tablespace pg_default;

  create table
  public.versicherungen (
    id serial not null,
    versicherungs_nr character varying(50) not null,
    name character varying(100) not null,
    abdeckung character varying(50) null,
    beginn date not null,
    ende date not null,
    typ character varying(50) null,
    betrag numeric(10, 2) null,
    anbieter character varying null,
    kundennummer character varying not null,
    versicherungstyp character varying not null,
    deckungssumme numeric not null,
    selbstbeteiligung numeric not null,
    versicherungsstatus character varying null,
    bemerkungsfeld text null,
    constraint versicherungen_pkey primary key (id),
    constraint versicherungen_versicherungs_nr_key unique (versicherungs_nr)
  ) tablespace pg_default;

  create table
  public.zusatzleistungen (
    zusatzid serial not null,
    versicherung_id integer not null,
    zusatztitel character varying(255) not null,
    zusatz_deckungssumme numeric(10, 2) null,
    zusatzbeschreibung text null,
    created_at timestamp without time zone null default current_timestamp,
    constraint zusatzleistungen_pkey primary key (zusatzid),
    constraint zusatzleistungen_versicherung_id_fkey foreign key (versicherung_id) references versicherungen (id) on delete cascade
  ) tablespace pg_default;

  
  
Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
