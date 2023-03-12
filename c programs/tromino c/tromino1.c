#include <stdio.h>
#include <stdlib.h>
#include <math.h>

void tromino(int x_board, int y_board, int x_missing, int y_missing, int board_size);

int main() {
    int board_size, x_missing, y_missing;
    printf("Enter the board size (must be a power of 2): ");
    scanf("%d", &board_size);
    printf("Enter the x-coordinate of the missing square: ");
    scanf("%d", &x_missing);
    printf("Enter the y-coordinate of the missing square: ");
    scanf("%d", &y_missing);
    printf("Board size: %d x %d\n", board_size, board_size);
    printf("Missing square: (%d, %d)\n", x_missing, y_missing);
    tromino(0, 0, x_missing, y_missing, board_size);
    return 0;
}

void tromino(int x_board, int y_board, int x_missing, int y_missing, int board_size) {
    if (board_size == 2) {
        if (x_missing == x_board && y_missing == y_board+1) {
            printf("MS LR\nLR LR\n");
        } else if (x_missing == x_board && y_missing == y_board) {
            printf("LL MS\nLR LR\n");
        } else if (x_missing == x_board+1 && y_missing == y_board) {
            printf("LR LL\nLR MS\n");
        } else {
            printf("LR LR\nMS LL\n");
        }
        return;
    }

    int half_size = board_size/2;
    int x_center = x_board + half_size;
    int y_center = y_board + half_size;


    // Determine which quadrant the missing square is in
    if (x_missing < x_center && y_missing >= y_center) {
        // Missing square is in top-left quadrant
        int x_upper_left = x_center - 1;
        int y_upper_left = y_center;
        int x_upper_right = x_center;
        int y_upper_right = y_center;
        int x_lower_left = x_center;
        int y_lower_left = y_board + half_size - 1;
        int x_lower_right = x_center - 1;
        int y_lower_right = y_board + half_size;
        tromino(x_board, y_board + half_size, x_upper_left, y_upper_left, half_size);
        tromino(x_center, y_center, x_upper_right, y_upper_right, half_size);
        tromino(x_center, y_board, x_lower_left, y_lower_left, half_size);
        tromino(x_board, y_board, x_lower_right, y_lower_right, half_size);
    } else if (x_missing >= x_center && y_missing >= y_center) {
        // Missing square is in top-right quadrant
        int x_upper_left = x_board;
        int y_upper_left = y_center;
        int x_upper_right = x_missing;
        int y_upper_right = y_missing;
        int x_lower_left = x_center;
        int y_lower_left = y_board + half_size - 1;
        int x_lower_right = x_center - 1;
        int y_lower_right = y_board + half_size;
        tromino(x_board, y_center, x_upper_left, y_upper_left, half_size);
        tromino(x_center, y_center, x_upper_right, y_upper_right, half_size);
        tromino(x_center, y_board, x_lower_left, y_lower_left, half_size);
        tromino(x_board, y_board, x_lower_right, y_lower_right, half_size);
    } else if (x_missing >= x_center && y_missing < y_center) {
        // Missing square is in bottom-right quadrant
       int x_upper_left = x_board;
int y_upper_left = y_board + half_size;
int x_upper_right = x_board + half_size - 1;
int y_upper_right = y_board + half_size;
int x_lower_left = x_center;
int y_lower_left = y_board;
int x_lower_right = x_missing;
int y_lower_right = y_missing;

tromino(x_board, y_board + half_size, x_upper_left, y_upper_left, half_size);
tromino(x_board + half_size, y_board + half_size, x_upper_right, y_upper_right, half_size);
tromino(x_center, y_board, x_lower_left, y_lower_left, half_size);
tromino(x_missing, y_missing, x_lower_right, y_lower_right, half_size);
}
else if (x_missing < x_center && y_missing < y_center) {
    // Missing square is in bottom-left quadrant
    int x_upper_left = x_center - 1;
    int y_upper_left = y_board + half_size;
    int x_upper_right = x_center;
    int y_upper_right = y_board + half_size;
    int x_lower_left = x_board;
    int y_lower_left = y_board;
    int x_lower_right = x_board + half_size - 1;
    int y_lower_right = y_board + half_size - 1;
    tromino(x_center, y_board + half_size, x_upper_left, y_upper_left, half_size);
    tromino(x_board, y_board, x_lower_left, y_lower_left, half_size);
    tromino(x_board + half_size, y_board, x_lower_right, y_lower_right, half_size);
    tromino(x_board + half_size, y_board + half_size, x_upper_right, y_upper_right, half_size);
}
}
       

