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
   int num_sides = 10;
   std::string polygon_name = "decagram";
   std::ifstream ifs("input_" + polygon_name + ".tex");
   std::string general_template( (std::istreambuf_iterator<char>(ifs) ),
                       (std::istreambuf_iterator<char>()    ) );

   for (int step = 2; step <= num_sides/2; ++step) {
      int cur = 0;
      std::string polygon;
      std::set<int> seen;
      for (int i = 0; i < num_sides; ++i) {
         seen.insert(cur);
         polygon +=  "P" + std::to_string(cur+1) + (i == num_sides - 1 ? "" : ",");
         cur = (cur + step) % num_sides;
      }
      // If we did not see all vertices, then it is not a star polygon.
      if (seen.size() < num_sides) continue;
      std::string filename = "regular_" + polygon_name + "_" + std::to_string(step) + "_el";
      std::cout << "generate_fig " << filename << std::endl;
      std::ofstream ofs(filename + ".tex");
      std::string contents = general_template;
      replace_all(contents, "POLYGON_HERE", polygon);
      ofs << contents;
   }
   return 0;
}

