'use client';

import { useCallback, useState } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import ExerciseList from '@/components/common/ExerciseList';
import { Exercise } from '@/types';
import { searchExercises } from '@/services/api';
import { handleSignOut } from '@/lib/auth-actions';

interface SearchPageProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

export default function SearchPage({ user }: SearchPageProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setExercises([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    const results = await searchExercises(query);
    setExercises(results);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              Hello, {user.firstName || user.email}
            </p>
            <form action={handleSignOut}>
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-gray-700 underline cursor-pointer"
              >
                Sign out
              </button>
            </form>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
            Gym Exercise Search
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Find exercises by name to build your perfect workout
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <ExerciseList
          exercises={exercises}
          isLoading={isLoading}
          hasSearched={hasSearched}
        />
      </main>
    </div>
  );
}
