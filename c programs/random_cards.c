#include <iostream>

using namespace std;

void tromino(int x_board, int y_board, int x_missing, int y_missing, int board_size);

int main() {
    int x_missing, y_missing, board_size;
    while (true) {
        cout << "Please enter size of board (0 to quit): ";
        cin >> board_size;
        if (board_size == 0) {
            break;
        }
        cout << "Please enter coordinates of missing square (separate by a space): ";
        cin >> x_missing >> y_missing;
        tromino(0, 0, x_missing, y_missing, board_size);
    }
    return 0;
}

