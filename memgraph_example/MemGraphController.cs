using System;
using System.Collections.Generic;
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

        public MemGraphController(ISession session, ILogger<MemGraphController> log)
        {
            this.session = session;
            this.log = log;
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            string command;
            IStatementResult result;

            using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
                command = await reader.ReadToEndAsync();

            log.LogInformation($">>> Execute: {command}");
            try
            {
                result = session.Run(command);
            }
            catch (ClientException e)
            {
                log.LogError(e, e.Message);
                return BadRequest(new {message = e.Message});
            }

            return Ok(new
            {
                data = result.GetEnumerator()
            });
        }
    }
}