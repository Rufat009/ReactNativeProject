import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, Button, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import { fetchCocktails, fetchRandomCocktail } from '../store/slices/cocktailSlice';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: cocktails, status } = useSelector((state) => state.cocktails);
  const [categories, setCategories] = useState([]);
  const [glasses, setGlasses] = useState([]);
  const [alcoholicTypes, setAlcoholicTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGlass, setSelectedGlass] = useState('');
  const [selectedAlcoholic, setSelectedAlcoholic] = useState('');
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoryRes, glassRes, alcoholRes] = await Promise.all([
          axios.get('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list'),
          axios.get('https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list'),
          axios.get('https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list'),
        ]);

        setCategories(categoryRes.data.drinks || []);
        setGlasses(glassRes.data.drinks || []);
        setAlcoholicTypes(alcoholRes.data.drinks || []);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  const handleSearch = useCallback(async () => {
    let url = '';

    if (searchName) {
      url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchName}`;
    } else {
      url = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?';
      if (selectedCategory) url += `c=${selectedCategory}&`;
      if (selectedGlass) url += `g=${selectedGlass}&`;
      if (selectedAlcoholic) url += `a=${selectedAlcoholic}&`;
    }

    try {
      const response = await axios.get(url);
      const cocktailsData = response.data.drinks || [];
      dispatch(fetchCocktails(cocktailsData));
    } catch (error) {
      console.error('Error fetching cocktails:', error);
    }
  }, [searchName, selectedCategory, selectedGlass, selectedAlcoholic, dispatch]);

  const handleRandomCocktail = useCallback(async () => {
    await dispatch(fetchRandomCocktail());
  }, [dispatch]);

  const renderCocktailItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.cocktailItem}
      onPress={() => navigation.navigate('Details', { item })}
    >
      <Image source={{ uri: item.strDrinkThumb }} style={styles.image} />
      <Text>{item.strDrink}</Text>
    </TouchableOpacity>
  ), [navigation]);

  const categoryItems = useMemo(() => categories.map((cat) => ({ label: cat.strCategory, value: cat.strCategory })), [categories]);
  const glassItems = useMemo(() => glasses.map((glass) => ({ label: glass.strGlass, value: glass.strGlass })), [glasses]);
  const alcoholicItems = useMemo(() => alcoholicTypes.map((type) => ({ label: type.strAlcoholic, value: type.strAlcoholic })), [alcoholicTypes]);

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Cocktail Name"
        value={searchName}
        onChangeText={setSearchName}
      />
      <Button title="Search" onPress={handleSearch} />
      <Button title="Get Random Cocktail" onPress={handleRandomCocktail} />

      <RNPickerSelect
        onValueChange={(value) => setSelectedCategory(value)}
        items={categoryItems}
        placeholder={{ label: 'Filter by Category', value: null }}
      />

      <RNPickerSelect
        onValueChange={(value) => setSelectedGlass(value)}
        items={glassItems}
        placeholder={{ label: 'Filter by Glass', value: null }}
      />

      <RNPickerSelect
        onValueChange={(value) => setSelectedAlcoholic(value)}
        items={alcoholicItems}
        placeholder={{ label: 'Filter by Alcoholic', value: null }}
      />

      {status === 'loading' ? (
        <Text>Loading...</Text>
      ) : cocktails.length > 0 ? (
        <FlatList
          data={cocktails}
          keyExtractor={(item) => item.idDrink}
          renderItem={renderCocktailItem}
        />
      ) : (
        <Text style={styles.noResults}>No cocktails found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  cocktailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});


export default HomeScreen;