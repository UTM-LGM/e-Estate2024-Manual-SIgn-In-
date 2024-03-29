﻿using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace E_EstateV2_API.Repository
{
    public class FieldProductionRepository: IFieldProductionRepository
    {
        private readonly ApplicationDbContext _context;

        public FieldProductionRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<DTO_FieldProduction>> GetFieldProductions()
        {
            var production = await _context.fieldProductions.Select(x => new DTO_FieldProduction
            {
                id = x.Id,
                monthYear = x.monthYear,
                cuplump = x.cuplump,
                cuplumpDRC = x.cuplumpDRC,
                latex = x.latex,
                latexDRC = x.latexDRC,
                uss = x.USS,
                ussDRC = x.USSDRC,
                others = x.others,
                othersDRC = x.othersDRC,
                noTaskTap = x.noTaskTap,
                noTaskUntap = x.noTaskUntap,
                fieldId = x.fieldId,
                remarkUntap = x.remarkUntap,
                estateId = _context.estates.Where(y => y.Id == (_context.fields.Where(f => f.Id == x.fieldId).Select(f => f.estateId).FirstOrDefault())).Select(e => e.Id).FirstOrDefault(),
                fieldName = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.fieldName).FirstOrDefault(),
                totalTask = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.totalTask).FirstOrDefault()
            }).ToListAsync();

            return production;
        }

        public async Task<IEnumerable<FieldProduction>> AddFieldProduction(FieldProduction[] fieldProduction)
        {
            foreach (var item in fieldProduction)
            {

                item.createdDate = DateTime.Now;
                await _context.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return fieldProduction;
        }

        public async Task<FieldProduction> UpdateFieldProduction(FieldProduction fieldProduction)
        {
            var existingProduction = await _context.fieldProductions.FirstOrDefaultAsync(x => x.Id == fieldProduction.Id);
            if (existingProduction != null)
            {
                existingProduction.cuplump = fieldProduction.cuplump;
                existingProduction.cuplumpDRC = fieldProduction.cuplumpDRC;
                existingProduction.latex = fieldProduction.latex;
                existingProduction.latexDRC = fieldProduction.latexDRC;
                existingProduction.USS = fieldProduction.USS;
                existingProduction.USSDRC = fieldProduction.USSDRC;
                existingProduction.others = fieldProduction.others;
                existingProduction.othersDRC = fieldProduction.othersDRC;
                existingProduction.noTaskTap = fieldProduction.noTaskTap;
                existingProduction.noTaskUntap = fieldProduction.noTaskUntap;
                existingProduction.remarkUntap = fieldProduction.remarkUntap;
                existingProduction.updatedBy = fieldProduction.updatedBy;
                existingProduction.updatedDate = DateTime.Now;
                await _context.SaveChangesAsync();
                return existingProduction;
            }
            return null;
        }
    }
}
