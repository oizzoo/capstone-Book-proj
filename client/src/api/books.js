import { supabase } from "../supabaseClient";

// Pobierz książki użytkownika
export async function getBooks(userId) {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching books:", error);
    return [];
  }
  return data;
}

// Dodaj nową książkę
export async function addBook(bookData) {
  const { data, error } = await supabase.from("books").insert([bookData]);
  if (error) console.error("Error adding book:", error);
  return data;
}
