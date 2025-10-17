/*
  # Create chat messages table

  1. New Tables
    - `chat_messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `role` (text) - Either 'user' or 'assistant' to identify message sender
      - `content` (text) - The actual message content
      - `status` (text) - Message status: 'sending', 'sent', 'processing', 'completed', 'error'
      - `created_at` (timestamptz) - When the message was created
      - `updated_at` (timestamptz) - When the message was last updated
      
  2. Security
    - Enable RLS on `chat_messages` table
    - Add policy for public read access (demo purposes)
    - Add policy for public insert access (demo purposes)
    - Add policy for public update access (demo purposes)

  3. Notes
    - This is a demo application with public access
    - In production, you would restrict access based on user authentication
    - Messages are ordered by created_at for display in chat interface
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'processing', 'completed', 'error')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read messages"
  ON chat_messages
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert messages"
  ON chat_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update messages"
  ON chat_messages
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries ordered by creation time
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at DESC);