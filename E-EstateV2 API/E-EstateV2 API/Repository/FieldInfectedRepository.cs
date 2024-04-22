﻿using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Migrations;
using E_EstateV2_API.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace E_EstateV2_API.Repository
{
    public class FieldInfectedRepository: IFieldInfectedRepository
    {
        private readonly ApplicationDbContext _context;

        public FieldInfectedRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FieldInfected> Add(FieldInfected entity)
        {
            await _context.Set<FieldInfected>().AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<List<FieldInfected>> GetAll()
        {
            return await _context.Set<FieldInfected>().ToListAsync();
        }

        public async Task<FieldInfected> Update(FieldInfected entity)
        {
            _context.Set<FieldInfected>().Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<List<DTO_FieldInfected>> GetFieldInfectedByEstateId(int estateId)
        {
            // Find all fieldIds associated with the given estateId
            var fieldIds = await _context.fields
                .Where(f => f.estateId == estateId)
                .Select(f => f.Id)
                .ToListAsync(); // Retrieve all fieldIds matching the estateId

            // Query for fieldInfecteds that have fieldId values matching the fieldIds
            var fieldInfecteds = await _context.fieldInfecteds
                .Where(fi => fieldIds.Contains(fi.fieldId ?? 0))
                .Select(fi => new DTO_FieldInfected
                {
                    id = fi.Id,
                    fieldId = fi.fieldId,
                    dateScreening = fi.dateScreening,
                    fieldDiseaseId = fi.fieldDiseaseId,
                    areaInfected = fi.areaInfected,
                    isActive = fi.isActive,
                    fieldName = _context.fields.Where(x=>x.Id == fi.fieldId).Select(x=>x.fieldName).FirstOrDefault(),
                    diseaseName = _context.fieldDiseases.Where(x=>x.Id == fi.fieldDiseaseId).Select(x=>x.diseaseName).FirstOrDefault(),
                    area = _context.fields.Where(x=>x.Id == fi.fieldId).Select(x=>x.area).FirstOrDefault(),
                    remark = fi.remark,
                    severityLevel = fi.severityLevel,
                    dateRecovered = fi.dateRecovered
                })
                .ToListAsync(); // Retrieve all matching fieldInfecteds

            return fieldInfecteds;
        }

        public async Task<FieldInfected> UpdateFieldInfectedRemark(FieldInfected fieldInfected)
        {
            var existingField = await _context.fieldInfecteds.FirstOrDefaultAsync(x => x.Id == fieldInfected.Id);
            if (existingField != null)
            {
                existingField.updatedDate = DateTime.Now;
                existingField.updatedBy = fieldInfected.updatedBy;
                existingField.isActive = fieldInfected.isActive;
                existingField.remark = fieldInfected.remark;
                existingField.dateRecovered = fieldInfected.dateRecovered;
                await _context.SaveChangesAsync();
                return existingField;
            }
            return null;
        }

        public async Task<List<DTO_FieldInfected>> GetFieldInfectedById(int id)
        {
            var fieldInfected = await _context.fieldInfecteds.Where(x => x.fieldId == id).Select(x => new DTO_FieldInfected
            {
                id = x.Id,
                fieldId = x.fieldId,
                dateScreening = x.dateScreening,
                fieldDiseaseId = x.fieldDiseaseId,
                areaInfected = x.areaInfected,
                isActive = x.isActive,
                fieldName = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.fieldName).FirstOrDefault(),
                diseaseName = _context.fieldDiseases.Where(y => y.Id == x.fieldDiseaseId).Select(y => y.diseaseName).FirstOrDefault(),
                area = _context.fields.Where(y => y.Id == x.fieldId).Select(x => x.area).FirstOrDefault(),
                remark = x.remark,
                severityLevel = x.severityLevel,
                dateRecovered = x.dateRecovered
            }).ToListAsync();
            return fieldInfected;
        }
    }
}
