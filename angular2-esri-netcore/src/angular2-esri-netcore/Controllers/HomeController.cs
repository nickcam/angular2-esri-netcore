using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace angular2_esri_netcore.Controllers
{
    public class HomeController : Controller
    {
        
        public IActionResult Index()
        {
            // create a hash of build.js so we can use it in query string to make sure new versions bust any browser cache.
            string buildHash = "bh";
            var buildPath = System.IO.Directory.GetCurrentDirectory() + "\\wwwroot\\dist\\build.js";
            if (System.IO.File.Exists(buildPath))
            {
                var build = System.IO.File.ReadAllText(buildPath);
                buildHash = CreateMd5Hash(build);
            }

            ViewBag.BuildHash = buildHash;

            return View();
        }

        private string CreateMd5Hash(string input)
        {
            using (MD5 md5Hash = MD5.Create())
            {
                // Convert the input string to a byte array and compute the hash.
                byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

                // Create a new Stringbuilder to collect the bytes
                // and create a string.
                StringBuilder sBuilder = new StringBuilder();

                // Loop through each byte of the hashed data 
                // and format each one as a hexadecimal string.
                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }

                // Return the hexadecimal string.
                return sBuilder.ToString();

            }
        }
    }
}
