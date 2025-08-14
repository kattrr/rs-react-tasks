'use server';

import { exportSelectedItems } from '@/services/CSVExportService';
import type { SelectedItem } from '@/store/selectedItemsStore';

export async function exportCSVAction(
  items: SelectedItem[],
  filename: string
): Promise<{ success: boolean; data: string; filename: string }> {
  try {
    if (items.length === 0) {
      return {
        success: false,
        data: '',
        filename: '',
      };
    }

    // Compile CSV on the server
    const csvContent = exportSelectedItems(items);

    return {
      success: true,
      data: csvContent,
      filename: filename,
    };
  } catch (error) {
    console.error('Error exporting CSV on server:', error);
    return {
      success: false,
      data: '',
      filename: '',
    };
  }
}
