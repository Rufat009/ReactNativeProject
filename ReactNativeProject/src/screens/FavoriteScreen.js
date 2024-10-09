import React, { useMemo } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const FavoriteScreen = ({ navigation }) => {
  const favorites = useSelector((state) => state.cocktails.favorites);

  const favoriteList = useMemo(() => favorites, [favorites]);

  return (
    <View style={styles.container}>
      {favoriteList.length === 0 ? (
        <Text>No favorites yet</Text>
      ) : (
        <FlatList
          data={favoriteList}
          keyExtractor={(item) => item.idDrink}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.cocktailItem}
              onPress={() => navigation.navigate('Details', { item })}
            >
              <Image source={{ uri: item.strDrinkThumb }} style={styles.image} />
              <Text>{item.strDrink}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
});

export default FavoriteScreen;