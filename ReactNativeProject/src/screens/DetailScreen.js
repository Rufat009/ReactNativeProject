import React, { useMemo } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/cocktailSlice';

const DetailScreen = ({ route }) => {
  const { item } = route.params;
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.cocktails.favorites);

  const isFavorite = useMemo(() => 
    favorites.some(cocktail => cocktail.idDrink === item.idDrink), 
    [favorites, item.idDrink]
  );

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite(item.idDrink));
    } else {
      dispatch(addFavorite(item));
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.strDrinkThumb }} style={styles.image} />
      <Text>{item.strDrink}</Text>
      <Text>{item.strInstructions}</Text>
      <Button 
        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        onPress={handleFavoriteToggle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
  },
});

export default DetailScreen;