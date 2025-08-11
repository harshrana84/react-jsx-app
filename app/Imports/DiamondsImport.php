<?php

namespace App\Imports;

use App\Models\Diamond;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class DiamondsImport implements ToModel, WithHeadingRow
{
    // Columns that are numeric (DECIMAL, FLOAT, INTEGER) in your DB
    protected $numericFields = [
        'carat',
        'rap_price',
        'discount',
        'per_ct',
        'total',
        'sale_discount_percent',
        'sale_per_ct',
        'sale_total',
        'table',
        'depth',
        'cr_ang',
        'cr_ht',
        'pv_ang',
        'pv_ht',
        'ratio',
        'girdle_percent',
        'length',
        'width',
        'height',
        'r1',
        'r2',
        'seagoma',
        'export_total_usd'
    ];

    public function model(array $row)
    {
        // Check if the row is completely empty (all columns are blank/null)
        if (
            empty(array_filter($row, function ($value) {
                return !is_null($value) && $value !== '';
            }))
        ) {
            return null; // Skip this row entirely
        }

        // Skip if the mandatory fields are missing
        if (empty($row['stock_id']) || empty($row['carat'])) {
            return null;
        }

        // Convert all empty numeric values to NULL
        foreach ($this->numericFields as $field) {
            if (isset($row[$field]) && $row[$field] === '') {
                $row[$field] = null;
            }
        }

        // Convert all empty date fields to NULL
        foreach (['export_date', 'import_date'] as $dateField) {
            if (empty($row[$dateField])) {
                $row[$dateField] = null;
            }
        }


        return new Diamond([
            'stock_id' => $row['stock_id'] ?? null,
            'availability' => $row['availability'] ?? null,
            'report_no' => $row['report_no'] ?? null,
            'shape' => $row['shape'] ?? null,
            'carat' => $row['carat'] ?? null,
            'color' => $row['color'] ?? null,
            'clarity' => $row['clarity'] ?? null,
            'cut' => $row['cut'] ?? null,
            'polish' => $row['polish'] ?? null,
            'symmetry' => $row['symmetry'] ?? null,
            'fluorescence' => $row['fluorescence'] ?? null,
            'rap_price' => $row['rap_price'] ?? null,
            'discount' => $row['discount'] ?? null,
            'per_ct' => $row['per_ct'] ?? null,
            'total' => $row['total'] ?? null,
            'sale_discount_percent' => $row['sale_discount_percent'] ?? null,
            'sale_per_ct' => $row['sale_per_ct'] ?? null,
            'sale_total' => $row['sale_total'] ?? null,
            'hold_name' => $row['hold_name'] ?? null,
            'h_and_a' => $row['h_and_a'] ?? null,
            'remark' => $row['remark'] ?? null,
            'lab' => $row['lab'] ?? null,
            'cut_no' => $row['cut_no'] ?? null,
            'country' => $row['country'] ?? null,
            'state' => $row['state'] ?? null,
            'city' => $row['city'] ?? null,
            'bgm' => $row['bgm'] ?? null,
            'eye_clean' => $row['eye_clean'] ?? null,
            'treatment' => $row['treatment'] ?? null,
            'growth_type' => $row['growth_type'] ?? null,
            'company' => $row['company'] ?? null,
            'laser_inscription' => $row['laser_inscription'] ?? null,
            'measurement' => $row['measurement'] ?? null,
            'table' => $row['table'] ?? null,
            'depth' => $row['depth'] ?? null,
            'cr_ang' => $row['cr_ang'] ?? null,
            'cr_ht' => $row['cr_ht'] ?? null,
            'pv_ang' => $row['pv_ang'] ?? null,
            'pv_ht' => $row['pv_ht'] ?? null,
            'ratio' => $row['ratio'] ?? null,
            'girdle_percent' => $row['girdle_percent'] ?? null,
            'length' => $row['length'] ?? null,
            'width' => $row['width'] ?? null,
            'height' => $row['height'] ?? null,
            'girdle_condition' => $row['girdle_condition'] ?? null,
            'culet' => $row['culet'] ?? null,
            'video_link' => $row['video_link'] ?? null,
            'image_link' => $row['image_link'] ?? null,
            'cert_pdf_link' => $row['cert_pdf_link'] ?? null,
            'origin' => $row['origin'] ?? null,
            'digital_report' => $row['digital_report'] ?? null,
            'r1' => $row['r1'] ?? null,
            'r2' => $row['r2'] ?? null,
            'seagoma' => $row['seagoma'] ?? null,
            'full_fancy_color' => $row['full_fancy_color'] ?? null,
            'fancy_color' => $row['fancy_color'] ?? null,
            'fancy_overtone' => $row['fancy_overtone'] ?? null,
            'fancy_intensity' => $row['fancy_intensity'] ?? null,
            'comment' => $row['comment'] ?? null,
            'export_inv_no' => $row['export_inv_no'] ?? null,
            'export_total_usd' => $row['export_total_usd'] ?? null,
            'export_date' => $row['export_date'] ?? null,
            'import_date' => $row['import_date'] ?? null,
        ]);
    }
}
