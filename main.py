from functools import reduce

# define the possible suits and ranks
suits = ['Spade', 'Heart', 'Club', 'Diamond']
ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

# define the mapper function to parse each card and return the suit and rank
def mapper(cards):
    return [(card.split(",")[0], card.split(",")[1]) for card in cards]

# define the reducer function to find the missing cards
def reducer(cards):
    present_cards = set(cards)
    all_cards = set((suit, rank) for suit in suits for rank in ranks)
    missing_cards = list(all_cards - present_cards)
    return missing_cards

# read in the list of cards from the file
with open("random_cards.txt") as f:
    cards = [line.strip() for line in f]

# map the cards to (suit, rank) tuples and reduce to find the missing cards
missing_cards = reduce(lambda x, y: x+y, map(reducer, *map(mapper, [cards])))

# write the missing cards to a file
with open("missing_cards.txt", "w") as f:
    for card in missing_cards:
        f.write(card[0] + "," + card[1] + "\n")
