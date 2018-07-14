using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Neo4j.Driver.V1;

namespace memgraph_example
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemGraphController : ControllerBase
    {
        private readonly ISession session;
        private readonly ILogger<MemGraphController> log;
        private readonly Stopwatch stopwatch;

        public MemGraphController(ISession session, ILogger<MemGraphController> log)
        {
            this.session = session;
            this.log = log;
            this.stopwatch = new Stopwatch();
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            string command;
            var result = new List<IRecord>();

            using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
                command = await reader.ReadToEndAsync();
;
            log.LogInformation($">>> Execute: {command}");

            stopwatch.Restart();
            try
            {
                var cursor = await session.RunAsync(command);
                while (await cursor.FetchAsync())
                {
                    result.Add(cursor.Current);
                }
                stopwatch.Stop();
            }
            catch (ClientException e)
            {
                var msg = "Error while exectiong query.";
                log.LogError(e, msg);
                return BadRequest(new
                {
                    message = msg,
                    details = e.Message,
                    elapsed = stopwatch.Elapsed
                });
            }

            return Ok(new
            {
                data = result,
                elapsed = stopwatch.Elapsed
            });
        }
    }
}