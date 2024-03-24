import { configureStore } from '@reduxjs/toolkit';
import userDataReducer, { setUserData, updateUserData } from '../../redux/userDataSlice';
import { UserData } from '../../virtualmodel/VMD';

describe('userDataSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: { userData: userDataReducer } });
  });

  it('sets user data', () => {
    // Arrange
    const userData: UserData[] = [
      { email: 'test1@example.com', /* other fields */ },
      { email: 'test2@example.com', /* other fields */ },
      // Add more user data as needed
    ];

    // Act
    store.dispatch(setUserData(userData));

    // Assert
    expect(store.getState().userData.users).toEqual(userData);
  });

  it('updates user data', () => {
    // Arrange
    const initialUserData: UserData[] = [
      { email: 'test1@example.com', /* other fields */ },
      { email: 'test2@example.com', /* other fields */ },
      // Add more user data as needed
    ];
    store.dispatch(setUserData(initialUserData));

    const updatedUser: UserData = { email: 'test1@example.com', /* updated fields */ };

    // Act
    store.dispatch(updateUserData(updatedUser));

    // Assert
    expect(store.getState().userData.users).toContainEqual(updatedUser);
  });
});