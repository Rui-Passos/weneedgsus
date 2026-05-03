
-- Gallery items table
CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image','video')),
  caption text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery is public readable" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert gallery" ON public.gallery_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update gallery" ON public.gallery_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete gallery" ON public.gallery_items FOR DELETE TO authenticated USING (true);

-- Contact submissions
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  pet_type text,
  dates text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery','gallery', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read gallery bucket" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated upload gallery bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Authenticated update gallery bucket" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated delete gallery bucket" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');
