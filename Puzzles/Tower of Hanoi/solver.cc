#include <fstream>
#include <iostream>
#include <vector>

std::vector<int> pos;

int other(int a, int b) {
  if (a != 1 && b != 1) return 1;
  if (a != 2 && b != 2) return 2;
  return 3;
}

std::vector<int> centers = {0, 3, 8, 13};
std::vector<int> sizes = {0, 1, 2, 3, 4};
std::vector<std::string> colors = {"", "BlueClr", "RedClr", "GreenClr", "PurpleClr"};

int sol_num = 0;
std::string prefix = R"(
\documentclass[tikz]{standalone}
\usepackage{pgfplots}
\pgfplotsset{compat=1.15}
\usepackage{mathrsfs}
\usetikzlibrary{arrows,calc}
\usepackage{tkz-euclide}

\pagestyle{empty}

\definecolor{BlueClr}{RGB}{45,148,189}
\definecolor{GreenClr}{RGB}{94,176,62}
\definecolor{RedClr}{RGB}{232,99,63}
\definecolor{PurpleClr}{RGB}{146,83,194}

\begin{document}

\begin{tikzpicture}[scale=.75]

\draw[fill=orange,draw=none] (2.9,0.9) rectangle ++(0.2,4);
\draw[fill=orange,draw=none] (7.9,0.9) rectangle ++(0.2,4);
\draw[fill=orange,draw=none] (12.9,0.9) rectangle ++(0.2,4);
\draw[fill=black,draw=none] (0,0.9) rectangle ++(20,0.1);
)";
std::string suffix = R"(
\end{tikzpicture}
\end{document}
)";
void printSolution() {
  std::vector<std::vector<int>> st(pos.size());
  std::string name = "tower_hanoi_" + std::to_string(pos.size() - 1) + "_sol_step_" + std::to_string(sol_num) + "el";
  std::ofstream f(name + ".tex");
  std::cout << "generate_fig " << name << std::endl;
  f << prefix;
  for (int i = pos.size() - 1; i >= 1; --i) {
    st[pos[i]].push_back(i);
    double height = 1 + (st[pos[i]].size() - 1) * 0.75;
    double start = centers[pos[i]] - sizes[i]/2.0;
    f << "\\draw[fill=" << colors[i] << ",draw=none] (" << start << "," << height << ") rectangle ++(" << sizes[i] << ",0.75);" << std::endl;
  }
  f << suffix;
  /* for (int i = 1; i < st.size(); ++i) {
    std::cout << i << " : ";
    for (auto v : st[i]) {
      std::cout << v << " ";
    }
    std::cout << std::endl;
  }
  std::cout << std::endl; */
  
  ++sol_num;
}

void solve(int n, int from, int to) {
  if (n == 0) {
    return;
  }
  solve(n-1, from, other(from, to));
  pos[n] = to;
  printSolution();
  solve(n-1, other(from, to), to);
}

int main() {
  int n = 3;
  pos.resize(n + 1, 1);
  printSolution();
  solve(n, 1, 3);
  return 0;
}
