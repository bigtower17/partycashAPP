--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12 (Debian 15.12-1.pgdg120+1)
-- Dumped by pg_dump version 15.12 (Debian 15.12-1.pgdg120+1)

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
-- Name: budget; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.budget (
    id integer NOT NULL,
    current_balance numeric(10,2) DEFAULT 0.00,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated_by integer,
    is_shared boolean DEFAULT true
);


ALTER TABLE public.budget OWNER TO admin;

--
-- Name: budget_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.budget_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.budget_id_seq OWNER TO admin;

--
-- Name: budget_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.budget_id_seq OWNED BY public.budget.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.events (
    id integer NOT NULL,
    name text NOT NULL,
    start_time timestamp without time zone DEFAULT now() NOT NULL,
    end_time timestamp without time zone,
    notes text
);


ALTER TABLE public.events OWNER TO admin;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO admin;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: location; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.location (
    id integer NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.location OWNER TO admin;

--
-- Name: location_budget; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.location_budget (
    id integer NOT NULL,
    location_id integer NOT NULL,
    current_balance numeric(12,2) DEFAULT 0 NOT NULL,
    last_updated_by integer,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.location_budget OWNER TO admin;

--
-- Name: location_budget_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.location_budget_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.location_budget_id_seq OWNER TO admin;

--
-- Name: location_budget_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.location_budget_id_seq OWNED BY public.location_budget.id;


--
-- Name: location_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.location_id_seq OWNER TO admin;

--
-- Name: location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.location_id_seq OWNED BY public.location.id;


--
-- Name: operations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.operations (
    id integer NOT NULL,
    user_id integer,
    type character varying(50),
    amount numeric(10,2),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    location_id integer
);


ALTER TABLE public.operations OWNER TO admin;

--
-- Name: operations_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.operations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.operations_id_seq OWNER TO admin;

--
-- Name: operations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.operations_id_seq OWNED BY public.operations.id;


--
-- Name: quotes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.quotes (
    id integer NOT NULL,
    user_id integer,
    name character varying(255) NOT NULL,
    notes text,
    amount numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted boolean DEFAULT false,
    paid_by integer,
    location_id integer
);


ALTER TABLE public.quotes OWNER TO admin;

--
-- Name: quotes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.quotes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quotes_id_seq OWNER TO admin;

--
-- Name: quotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.quotes_id_seq OWNED BY public.quotes.id;


--
-- Name: starting_cash; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.starting_cash (
    id integer NOT NULL,
    event_id integer,
    location_id integer,
    amount numeric(12,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    assigned_by integer,
    recovered_at timestamp without time zone,
    recovered_by integer,
    recovery_notes text
);


ALTER TABLE public.starting_cash OWNER TO admin;

--
-- Name: starting_cash_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.starting_cash_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.starting_cash_id_seq OWNER TO admin;

--
-- Name: starting_cash_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.starting_cash_id_seq OWNED BY public.starting_cash.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    username text,
    role text DEFAULT 'staff'::text,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: budget id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.budget ALTER COLUMN id SET DEFAULT nextval('public.budget_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: location id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location ALTER COLUMN id SET DEFAULT nextval('public.location_id_seq'::regclass);


--
-- Name: location_budget id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location_budget ALTER COLUMN id SET DEFAULT nextval('public.location_budget_id_seq'::regclass);


--
-- Name: operations id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.operations ALTER COLUMN id SET DEFAULT nextval('public.operations_id_seq'::regclass);


--
-- Name: quotes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.quotes ALTER COLUMN id SET DEFAULT nextval('public.quotes_id_seq'::regclass);


--
-- Name: starting_cash id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.starting_cash ALTER COLUMN id SET DEFAULT nextval('public.starting_cash_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: budget; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.budget (id, current_balance, updated_at, last_updated_by, is_shared) FROM stdin;
1	0.00	2025-04-09 00:58:52.617877	\N	t
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.events (id, name, start_time, end_time, notes) FROM stdin;
\.


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.location (id, name, is_active) FROM stdin;
\.


--
-- Data for Name: location_budget; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.location_budget (id, location_id, current_balance, last_updated_by, updated_at) FROM stdin;
\.


--
-- Data for Name: operations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.operations (id, user_id, type, amount, description, created_at, location_id) FROM stdin;
\.


--
-- Data for Name: quotes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.quotes (id, user_id, name, notes, amount, status, created_at, updated_at, deleted, paid_by, location_id) FROM stdin;
\.


--
-- Data for Name: starting_cash; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.starting_cash (id, event_id, location_id, amount, created_at, assigned_by, recovered_at, recovered_by, recovery_notes) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, email, password, created_at, username, role, is_deleted) FROM stdin;
3	Fabio@salerno.it	$2b$10$9/a1uXn8ci7BhW1zpiBFBO9rh21pxQ0jeX9v52pqanGISN/c5musy	2025-03-20 15:24:23.201612	Fabio	staff	f
1	torregrossa@test.it	$2b$10$bmKMGNmpfLJRQrO03mYOYu92BPWWCb/e6yyHizOzjydKzhS4n1SGS	2025-03-18 22:07:27.535622	torregrossa	admin	f
2	string	$2b$10$jGWsGAfMBslaKNkBCFtTNO8w0qM7arLMu3sVzuNerbXXfjKtZ7O3e	2025-03-18 23:57:17.785453	test	staff	f
9	aaa@a.it	$2b$10$4QqvyYlPpwfMw5q0csAoRu.fAj4oeRhHQj15CV0GJChI.YJcfa.rS	2025-04-09 00:03:27.714736	aaa	admin	f
10	123@123.coms	$2b$10$54I39KnGiatDual69UIjC.PNzn342ORsXdXykmprXzvfYqGeZdWqu	2025-04-09 00:06:32.421096	asdaa	staff	f
11	oronzo@oronzo.it	$2b$10$Rnf2oxG2XYEIB7wP75ybJOoQD4vy2QfHKuaaNWqj0sV5TFBTik.f.	2025-04-09 00:07:25.109618	oronzo	auditor	f
4	peppe@pinzino.it	$2b$10$uhtNHc18FvzihyYl9h45/ufhGOmykvESprCrz6Qdb7PpxFNm5C5uW	2025-03-20 15:29:39.698372	pinzino	admin	f
\.


--
-- Name: budget_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.budget_id_seq', 1, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.events_id_seq', 1, false);


--
-- Name: location_budget_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.location_budget_id_seq', 1, false);


--
-- Name: location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.location_id_seq', 1, false);


--
-- Name: operations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.operations_id_seq', 1, false);


--
-- Name: quotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.quotes_id_seq', 1, false);


--
-- Name: starting_cash_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.starting_cash_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- Name: budget budget_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: location_budget location_budget_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location_budget
    ADD CONSTRAINT location_budget_pkey PRIMARY KEY (id);


--
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);


--
-- Name: operations operations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.operations
    ADD CONSTRAINT operations_pkey PRIMARY KEY (id);


--
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- Name: starting_cash starting_cash_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.starting_cash
    ADD CONSTRAINT starting_cash_pkey PRIMARY KEY (id);


--
-- Name: location_budget unique_location_id; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location_budget
    ADD CONSTRAINT unique_location_id UNIQUE (location_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: budget budget_last_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_last_updated_by_fkey FOREIGN KEY (last_updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: location_budget location_budget_last_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location_budget
    ADD CONSTRAINT location_budget_last_updated_by_fkey FOREIGN KEY (last_updated_by) REFERENCES public.users(id);


--
-- Name: location_budget location_budget_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location_budget
    ADD CONSTRAINT location_budget_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id) ON DELETE CASCADE;


--
-- Name: operations operations_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.operations
    ADD CONSTRAINT operations_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id);


--
-- Name: operations operations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.operations
    ADD CONSTRAINT operations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: quotes quotes_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id);


--
-- Name: quotes quotes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: starting_cash starting_cash_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.starting_cash
    ADD CONSTRAINT starting_cash_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id);


--
-- Name: starting_cash starting_cash_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.starting_cash
    ADD CONSTRAINT starting_cash_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: starting_cash starting_cash_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.starting_cash
    ADD CONSTRAINT starting_cash_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id) ON DELETE CASCADE;


--
-- Name: starting_cash starting_cash_recovered_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.starting_cash
    ADD CONSTRAINT starting_cash_recovered_by_fkey FOREIGN KEY (recovered_by) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

