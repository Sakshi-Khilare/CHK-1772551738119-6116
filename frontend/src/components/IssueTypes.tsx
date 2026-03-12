import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const IssueTypes = () => {
  const issueTypes = [
    {
      title: "Road Infrastructure",
      description:
        "Report potholes, damaged roads, broken sidewalks, and street maintenance issues.",
      image:
        "https://source.roboflow.com/mLrV3eDpZcTmZ6sutVL1Q8Tt5u72/uAKaPkQhDei0Zq1aDzt6/original.jpg",
      count: "1,247 reports",
    },
    {
      title: "Waste Management",
      description:
        "Report illegal dumping, overflowing bins, litter, and garbage collection issues.",
      image:
        "https://thumbs.dreamstime.com/b/overflowing-trash-cans-emphasize-sorting-importance-bins-highlight-waste-proper-disposal-methods-312082699.jpg",
      count: "892 reports",
    },
    {
      title: "Water Leakage",
      description: "Report persistent water leakage from a broken pipeline.",
      image:
        "https://zeve.au/woolf/uploads/2024/02/leaking-pipe-blue.jpg",
      count: "534 reports",
    },
    {
      title: "Streetlight Failure",
      description:
        "Report non-functional streetlight causing reduced visibility and safety concerns.",
      image:
        "https://www.hindustantimes.com/ht-img/img/2023/07/23/1600x900/A-non-functioning-street-light-at-southern-bypass-_1690134239324.jpg",
      count: "678 reports",
    },
  ];

  return (
    <section className="py-20 bg-blue-50">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">
            What Can You Report?
          </h2>

          <p className="text-blue-700/80 max-w-2xl mx-auto">
            Our platform covers a wide range of civic issues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {issueTypes.map((type, index) => (
            <Card
              key={index}
              className="backdrop-blur-md bg-white/70 border border-white/20 shadow-lg rounded-xl overflow-hidden ring-1 ring-white/10"
            >

              <div className="relative w-full aspect-square overflow-hidden">
                <img
                  src={type.image}
                  alt={type.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                  {type.count}
                </div>
              </div>

              <div className="p-5">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-lg text-blue-900">
                    {type.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                  <p className="text-blue-700/80 text-sm">
                    {type.description}
                  </p>
                </CardContent>
              </div>

            </Card>
          ))}

        </div>
      </div>
    </section>
  );
};

export default IssueTypes;