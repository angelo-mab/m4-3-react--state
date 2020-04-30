import React from 'react';
import styled from 'styled-components';

import GlobalStyles from './GlobalStyles';//im not gonna recreate this lol

import Typeahead from './Typeahead';
import data from '../data';

function App(props) {
    // TODO!
    return (
        <>
            <GlobalStyles />
            <Wrapper>
                <Typeahead
                    suggestions={data.books}
                    categories={data.categories}
                    handleSelect={(suggestion) => {
                        alert('Selected: ' + suggestion.title)
                    }}
                />
            </Wrapper>
        </>
    );
}
const Wrapper = styled.div`
width: 100vw;
height: 100vh;
display:grid;
place-content: center;
`;
export default App;
