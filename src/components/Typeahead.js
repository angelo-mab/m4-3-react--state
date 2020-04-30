import React from 'react';
import styled from 'styled-components';

import { clamp } from '../utils';
import Suggestion from './Suggestion';

const Typeahead = ({
  suggestions,
  categories,
  maxResults = 6,
  handleSelect,
}) => {

  const [value, setValue] = React.useState('');
  const [isVisible, setIsVisible] = React.useState('false');
  const [selSuggestionIndex, setSelSuggestionIndex] = React.useState(0)
    ; let matchedSuggestions = suggestions
      .filter(suggestion => {
        // at least 2 characters
        // case insensitive
        const twoChar = value.length >= 2;
        const includesValue = suggestion.title
          .toLowerCase()
          .includes(value.toLowerCase());

        return twoChar && includesValue;
      })
      .slice(0, maxResults);

  const showSuggestions = matchedSuggestions.length > 0 && isVisible;
  const selSuggestion = matchedSuggestions[selSuggestionIndex];

  return (
    <Wrapper>
      <Row>
        <Input
          type='text'
          value={value}
          onChange={ev => setValue(ev.target.value)}
          onKeyDown={ev => {
            switch (ev.key) {
              case 'Enter': { //takes currently selected result
                handleSelect(selSuggestion);
                return;
              }

              case 'Escape': { // closes typeahead
                setIsVisible(false);
                return;
              }

              case 'ArrowUp':
              case 'ArrowDown': {
                ev.preventDefault(); //stops page from refreshing

                if (!matchedSuggestions) // no matches, no shifting
                  return;

                const direction = ev.key === 'ArrowDown' ? 'down' : 'up';

                let nextSuggestionIndex = selSuggestion; // makes a copy

                nextSuggestionIndex =
                  direction === 'down'
                    ? nextSuggestionIndex + 1
                    : nextSuggestionIndex - 1;
                nextSuggestionIndex = clamp(
                  nextSuggestionIndex,
                  0,
                  matchedSuggestions.length - 1
                );

                setSelSuggestionIndex(nextSuggestionIndex);
                return;
              }
              default: {
                setIsVisible(true);
                return;
              }
            }
          }}
        />
        <ClearButton onClick={() => setValue('')}>Clear</ClearButton>
      </Row>
      {showSuggestions && (
        <Suggestions id="results">
          {matchedSuggestions.map((suggestion, index) => {
            const category = categories[suggestion.categoryId];

            const isSelected = index === selSuggestionIndex;
            return (
              <>
                <Suggestion
                  key={suggestion.id}
                  suggestion={suggestion}
                  category={category}
                  isSelected={isSelected}
                  searchValue={value}
                  onMouseEnter={() => {
                    setSelSuggestionIndex(index);
                  }}
                  onMouseDown={() => {
                    handleSelect(suggestion);
                  }}
                />
              </>
            )
          })}
        </Suggestions>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
position: relative;
`;

const Row = styled.div`
display: flex;
`;

const Input = styled.input`
 width: 350px;
 height: 40px;
 padding: 0 12px;
 border: 1px solid #ccc;
 border-radius: 4px;
 font-size:18px;
`;

const Button = styled.button`
height:40px;
background: #2b00d7;
border-radius: 4px;
border:none;
padding: 0px 20px;
font-size: 18px;
color: #fff;
`;

const ClearButton = styled(Button)`
margin-left: 10px;
`;

const Suggestions = styled.li`
position: absolute;
width: 100%;
left: 0;
right: 0;
bottom: -10px;
padding: 10px;
border-radius: 4px;
box-shadow: 1px 5px 10px rgba(0, 0, 0, 0.2);
transform: translateY()(100%);
`;

export default Typeahead;