import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export const fetchCocktails = createAsyncThunk(
  'cocktails/fetchCocktails',
  async ({ searchName, selectedCategory, selectedGlass, selectedAlcoholic }) => {
    let url = '';

    if (searchName) {
      url = `${API_URL}/search.php?s=${searchName}`;
    } else {
      url = `${API_URL}/filter.php?`;
      if (selectedCategory) url += `c=${selectedCategory}&`;
      if (selectedGlass) url += `g=${selectedGlass}&`;
      if (selectedAlcoholic) url += `a=${selectedAlcoholic}&`;
    }

    const response = await axios.get(url);
    return response.data.drinks || [];
  }
);

export const fetchRandomCocktail = createAsyncThunk(
  'cocktails/fetchRandomCocktail',
  async () => {
    const response = await axios.get(`${API_URL}/random.php`);
    return response.data.drinks[0];
  }
);

const cocktailSlice = createSlice({
  name: 'cocktails',
  initialState: {
    items: [],
    favorites: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addFavorite: (state, action) => {
      if (!state.favorites.some(cocktail => cocktail.idDrink === action.payload.idDrink)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(cocktail => cocktail.idDrink !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCocktails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCocktails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCocktails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchRandomCocktail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRandomCocktail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = [action.payload];
      })
      .addCase(fetchRandomCocktail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addFavorite, removeFavorite } = cocktailSlice.actions;
export default cocktailSlice.reducer;