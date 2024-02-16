﻿using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class BuyersController : ControllerBase
    {
        private readonly IGenericRepository<Buyer> _genericRepository;

        public BuyersController(IGenericRepository<Buyer> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddBuyer([FromBody] Buyer buyer)
        {
            buyer.createdDate = DateTime.Now;
            var addedBuyer = await _genericRepository.Add(buyer);
            return Ok(addedBuyer);
        }

        [HttpGet]
        public async Task<IActionResult> GetBuyers()
        {
            var buyers = await _genericRepository.GetAll();
            return Ok(buyers);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateBuyer([FromBody] Buyer buyer)
        {
            buyer.updatedDate = DateTime.Now;
            var updatedBuyer = await _genericRepository.Update(buyer);
            return Ok(updatedBuyer);
        }
    }
}
