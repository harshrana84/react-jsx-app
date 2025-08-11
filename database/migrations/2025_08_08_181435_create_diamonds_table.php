<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDiamondsTable extends Migration
{
    public function up()
    {
        Schema::create('diamonds', function (Blueprint $table) {
            $table->id();
            $table->string('stock_id')->nullable();
            $table->string('availability')->nullable();
            $table->string('report_no')->nullable();
            $table->string('shape')->nullable();
            $table->decimal('carat', 8, 2)->nullable();
            $table->string('color')->nullable();
            $table->string('clarity')->nullable();
            $table->string('cut')->nullable();
            $table->string('polish')->nullable();
            $table->string('symmetry')->nullable();
            $table->string('fluorescence')->nullable();
            $table->decimal('rap_price', 12, 2)->nullable();
            $table->decimal('discount', 5, 2)->nullable();
            $table->decimal('per_ct', 12, 2)->nullable();
            $table->decimal('total', 14, 2)->nullable();
            $table->decimal('sale_discount_percent', 5, 2)->nullable();
            $table->decimal('sale_per_ct', 12, 2)->nullable();
            $table->decimal('sale_total', 14, 2)->nullable();
            $table->string('hold_name')->nullable();
            $table->string('h_and_a')->nullable();
            $table->string('remark')->nullable();
            $table->string('lab')->nullable();
            $table->string('cut_no')->nullable();
            $table->string('country')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->string('bgm')->nullable();
            $table->string('eye_clean')->nullable();
            $table->string('treatment')->nullable();
            $table->string('growth_type')->nullable();
            $table->string('company')->nullable();
            $table->string('laser_inscription')->nullable();
            $table->string('measurement')->nullable();
            $table->decimal('table', 5, 2)->nullable();
            $table->decimal('depth', 5, 2)->nullable();
            $table->decimal('cr_ang', 5, 2)->nullable();
            $table->decimal('cr_ht', 5, 2)->nullable();
            $table->decimal('pv_ang', 5, 2)->nullable();
            $table->decimal('pv_ht', 5, 2)->nullable();
            $table->decimal('ratio', 6, 2)->nullable();
            $table->decimal('girdle%', 6, 2)->nullable();
            $table->decimal('length', 8, 2)->nullable();
            $table->decimal('width', 8, 2)->nullable();
            $table->decimal('height', 8, 2)->nullable();
            $table->string('girdle_condition')->nullable();
            $table->string('culet')->nullable();
            $table->string('video_link')->nullable();
            $table->string('image_link')->nullable();
            $table->string('cert_pdf_link')->nullable();
            $table->string('origin')->nullable();
            $table->string('digital_report')->nullable();
            $table->string('r1')->nullable();
            $table->string('r2')->nullable();
            $table->string('seagoma')->nullable();
            $table->string('full_fancy_color')->nullable();
            $table->string('fancy_color')->nullable();
            $table->string('fancy_overtone')->nullable();
            $table->string('fancy_intensity')->nullable();
            $table->text('comment')->nullable();
            $table->string('export_inv_no')->nullable();
            $table->decimal('export_total_usd', 14, 2)->nullable();
            $table->date('export_date')->nullable();
            $table->date('import_date')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('diamonds');
    }
}
