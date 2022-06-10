--
-- PostgreSQL database dump
--

-- Dumped from database version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: spooky
--

CREATE TABLE public.users (
    id serial NOT NULL,
    username character varying(200) NOT NULL,
    email character varying(200) NOT NULL,
    password character varying(200) NOT NULL
);


ALTER TABLE public.users OWNER TO spooky;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: spooky
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO spooky;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: spooky
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: spooky
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: spooky
--

COPY public.users (id, username, email, password) FROM stdin;
1       Alpha   alpha@gmail.com password
2       w       wow@gmail.com   $2b$10$SitfdNPWR8x.rc6Gx3Fyf.EpW0nhnsysbgMCuB0mXF0B7p9IdHFV6
3       Alpha   light@gmail.com $2b$10$kbw2T4y4dzj7bJkwDuhz5ek1tIP91AsxGKoJyF8K6RhVICRzCL3s2
4       Goblin  goblin@gmail.com        $2b$10$.ZtIWgF6priPBhP3ldj64eaTunhTWAjnrc4peKYxWKaUA2e4qBZYW
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: spooky
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: spooky
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: spooky
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--
