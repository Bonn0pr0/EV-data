-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create EV datasets table for staff to manage
CREATE TABLE public.ev_datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  provider TEXT,
  size TEXT,
  format TEXT,
  price DECIMAL(10, 2),
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.ev_datasets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ev_datasets
CREATE POLICY "Anyone can view datasets"
  ON public.ev_datasets
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Staff can insert datasets"
  ON public.ev_datasets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'staff') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Staff can update their own datasets"
  ON public.ev_datasets
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Staff can delete their own datasets"
  ON public.ev_datasets
  FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for ev_datasets
CREATE TRIGGER update_ev_datasets_updated_at
  BEFORE UPDATE ON public.ev_datasets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();