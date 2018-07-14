using System;
using System.Linq;
using Xunit;

using Neo4j.Driver.V1;
using Xunit.Abstractions;

namespace tests
{
    public class ExampleRecords
    {
        private readonly ITestOutputHelper output;

        public ExampleRecords(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public void CreateData()
        {
            using (var driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.None))
            using (var session = driver.Session())
            {
                session.Run(
                    @"CREATE (p1:Student {id: 1, name: ""Luke""})
                    CREATE(p2: Employer { id: 2, name: ""John""})
                    CREATE(p3: Employer { id: 3, name: ""Ian""})
                    CREATE(p4: Employer { id: 4, name: ""Mark""})
                    CREATE(p5: Student { id: 5, name: ""Peter""})
                    CREATE(p6: Student:Employer { id: 6, name: ""Oliver""})
                    CREATE(p7: Student:Employer { id: 7, name: ""Harry""})
                    CREATE(p8: Student:Employer { id: 8, name: ""Jack""})
                    CREATE(p9: Student:Employer { id: 9, name: ""George""})
                    CREATE(p1) -[:FRIEND_OF]->(p3)
                    CREATE(p3) -[:FRIEND_OF]->(p4)
                    CREATE(p3) -[:FRIEND_OF]->(p2)
                    CREATE(p5) -[:FRIEND_OF]->(p3)
                    CREATE(p5) -[:FRIEND_OF]->(p6)
                    CREATE(p5) -[:FRIEND_OF]->(p7)
                    CREATE(p5) -[:FRIEND_OF]->(p8)
                    CREATE(p5) -[:FRIEND_OF]->(p9);").Consume();
            }
        }

        [Fact]
        public void TestData()
        {
            using (var driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.None))
            using (var session = driver.Session())
            {
                var result = session.Run("MATCH (n)-[r]->(m) RETURN n, r, m");

                foreach (var item in result)
                {
                    output.WriteLine(item.ToString());
                }

            }
        }
    }
}
