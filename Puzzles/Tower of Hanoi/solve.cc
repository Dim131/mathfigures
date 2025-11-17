#include <fstream>
#include <iostream>
#include <vector>

// Η θέση του i-οστού δίσκου.
std::vector<int> pos;

void printSolution();

// Επιστρέφει την στοίβα διαφορετική των a, b.
int other(int a, int b) {
  if (a != 0 && b != 0) return 0;
  if (a != 1 && b != 1) return 1;
  return 2;
}

// Mετακινεί τους δίσκους 0, 1, ..., n από την στοίβα from στην to.
void solve(int n, int from, int to) {
  if (n == -1) {
    return;
  }
  solve(n-1, from, other(from, to));
  pos[n] = to;
  printSolution();
  solve(n-1, other(from, to), to);
}

int main() {
  int n = 3;
  pos.resize(n, 0);
  printSolution();
  solve(n-1, 0, 2);
  return 0;
}

void printSolution() {
  std::vector<std::vector<int>> disks_at_pos(3);
  for (int i = pos.size() - 1; i >= 0; --i) {
    disks_at_pos[pos[i]].push_back(i);
  }
  for (int x = 0; x < 3; ++x) {
    std::cout << x << " : ";
    for (auto disk : disks_at_pos[x]) {
      std::cout << disk << " ";
    }
    std::cout << std::endl;
  }
  std::cout << std::endl;
}
