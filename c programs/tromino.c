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
        if (x_missing == x_board && y_missing == y_board) {
            printf("MS ");
            printf("LR\n");
            printf("LR ");
        }
        else if (x_missing == x_board && y_missing == y_board + 1) {
            printf("UL ");
            printf("MS\n");
            printf("UL ");
        }
        else if (x_missing == x_board + 1 && y_missing == y_board) {
            printf("LL ");
            printf("LL\n");
            printf("MS ");
        }
        else {
            printf("UR ");
            printf("UR\n");
            printf("UR ");
        }
    }
    else {
        int sub_board_size = board_size / 2;
        int x_center = x_board + sub_board_size;
        int y_center = y_board + sub_board_size;

        // Determine which quadrant the missing square is in
        if (x_missing < x_center && y_missing >= y_center) {
            // Missing square is in top-left quadrant
            tromino(x_board, y_center, x_center - 1, y_center, sub_board_size);
            tromino(x_center, y_center, x_center, y_center, sub_board_size);
            tromino(x_center, y_board, x_center, y_center - 1, sub_board_size);
            tromino(x_board, y_board, x_center, y_center, sub_board_size);
        }
        else if (x_missing >= x_center && y_missing >= y_center) {
            // Missing square is in top-right quadrant
            tromino(x_board, y_center, x_board, y_center, sub_board_size);
            tromino(x_center, y_center, x_missing, y_missing, sub_board_size);
            tromino(x_center, y_board, x_center, y_center - 1, sub_board_size);
            tromino(x_board, y_board, x_center, y_center, sub_board_size);
        }
         else if (x_missing < x_center && y_missing < y_center) {
        // Missing square is in bottom-left quadrant
        tromino(x_board, y_center, x_board, y_center, board_size / 2);
        tromino(x_center, y_center, x_center, y_center, board_size / 2);
        tromino(x_center, y_board, x_missing, y_missing, board_size / 2);
        tromino(x_board + board_size / 2, y_board + board_size / 2, x_center, y_center, board_size / 2);
    } else {
        // Missing square is in bottom-right quadrant
        tromino(x_board, y_center, x_board, y_center, board_size / 2);
        tromino(x_center, y_center, x_center, y_board + board_size / 2 - 1, board_size / 2);
        tromino(x_center, y_board, x_center, y_center - 1, board_size / 2);
        tromino(x_board + board_size / 2, y_board + board_size / 2, x_missing, y_missing, board_size / 2);
    }
}}
       

