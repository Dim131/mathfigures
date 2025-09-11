#include <fstream>
#include <iostream>
#include <set>
#include <string>

void replace_all(
    std::string& s,
    std::string const& toReplace,
    std::string const& replaceWith
) {
    std::string buf;
    std::size_t pos = 0;
    std::size_t prevPos;

    // Reserves rough estimate of final size of string.
    buf.reserve(s.size());

    while (true) {
        prevPos = pos;
        pos = s.find(toReplace, pos);
        if (pos == std::string::npos)
            break;
        buf.append(s, prevPos, pos - prevPos);
        buf += replaceWith;
        pos += toReplace.size();
    }

    buf.append(s, prevPos, s.size() - prevPos);
    s.swap(buf);
}

int main() {
   int num_sides = 20;
   std::ifstream ifs("input_approx_circum.tex");
   std::string general_template( (std::istreambuf_iterator<char>(ifs) ),
                       (std::istreambuf_iterator<char>()    ) );

   for (int step = 3; step <= num_sides; ++step) {
      int cur = 0;
      std::string polygon;
      std::string filename = "regular_polygon_" + std::to_string(step) + "approx_circum_el";
      std::cout << "generate_fig " << filename << std::endl;
      std::ofstream ofs(filename + ".tex");
      std::string contents = general_template;
      replace_all(contents, "XX", std::to_string(step));
      ofs << contents;
   }
   return 0;
}

