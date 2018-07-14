using System;
using System.Linq;
using Xunit;

using Neo4j.Driver.V1;

namespace tests
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            using (var driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.None))
                using (var session = driver.Session())
            {
                // Run basic queries.
                session.Run("MATCH (n) DETACH DELETE n").Consume();
                session.Run("CREATE (alice:Person {name: \"Alice\", age: 22})").Consume();
                var result = session.Run("MATCH (n) RETURN n").First();
                var alice = (INode)result["n"];
                Console.WriteLine(alice["name"]);
                Console.WriteLine(string.Join(", ", alice.Labels));
                Console.WriteLine(alice["age"]);
            }
        }
    }
}
