using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Intrinsics.X86;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components.Web;

namespace Application.Profiles
{
    public class UserActivityDto
    {
        public Guid Id { get; set; }

        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }

        [JsonIgnore]
        public string HostUsername { get; set; }
    }
}