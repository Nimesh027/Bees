import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
    colors: {
        primary: '#8A2BE2',
        secondary: '#000',
        accent: '#FFA500',
        background: '#FFF',
    },
    text: {
        heading: {
            fontSize: width * 0.07,
        },
        subheading: {
            fontSize: width * 0.047,
        },
        body: {
            fontSize: width * 0.031,
        },
    },
    dimensions: {
        width,
        height,
    },
};
