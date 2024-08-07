﻿using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class FieldCloneRepository:IFieldCloneRepository
    {
        private readonly ApplicationDbContext _context;

        public FieldCloneRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<FieldClone>> AddFieldClone(FieldClone[] fieldClone)
        {
            foreach (var item in fieldClone)
            {
                item.createdDate = DateTime.Now;
                item.isActive = true;
                await _context.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return fieldClone;
        }

        public async Task<List<FieldClone>> UpdateFieldCloneStatus(int fieldId)
        {
            var fieldClone = _context.fieldClones.Where(x => x.fieldId == fieldId).ToList();
            foreach (var item in fieldClone)
            {
                item.isActive = false;
                await _context.SaveChangesAsync();
            }
            return fieldClone;
        }

        public async Task UpdateFieldClones(int fieldId, FieldClone[] updatedFieldClones)
        {
            var existingFieldClones = await _context.fieldClones.Where(x => x.fieldId == fieldId).ToListAsync();

            // Allows efficient set operations to determine which existing FieldClone IDs are not in the updated list.
            var incomingCloneIds = new HashSet<int>(updatedFieldClones.Select(g => g.Id));

            foreach (var clone in updatedFieldClones)
            {
                if (clone.Id != 0)
                {
                    var existingClone = existingFieldClones.FirstOrDefault(x => x.Id == clone.Id);
                    if (existingClone != null)
                    {
                        existingClone.isActive = clone.isActive; // Update properties as needed
                    }
                }
                else
                {
                    clone.isActive = true; // Set isActive as needed
                    clone.fieldId = fieldId; // Set the associated FieldId
                    _context.fieldClones.Add(clone);
                }
            }

            foreach (var existingClone in existingFieldClones)
            {
                if (!incomingCloneIds.Contains(existingClone.Id))
                {
                    existingClone.isActive = false; // Deactivate the clone
                    existingClone.updatedDate = DateTime.Now; // Update the date
                }
            }

            await _context.SaveChangesAsync();
        }

    }
}
