﻿using Microsoft.AspNetCore.Identity;

namespace E_EstateV2_API.Models
{
    //if nk tukar id ke int letak IdentityUser<int>
    public class ApplicationUser :IdentityUser
    {
        public string fullName { get; set; }
        public string licenseNo { get; set; }
        public string position { get; set; }
        public bool isEmailVerified { get;set; }
    }
}
