<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VehicleImageSeeder extends Seeder
{
    public function run()
    {
        // Clear any old ones just in case
        DB::table('vehicle_images')->truncate();

        DB::table('vehicle_images')->insert([
            ['vehicle_id' => 1, 'image_category' => 'frontView', 'image_url' => '/vehicles/toyota_camry_2023_1772179587203.png'],
            ['vehicle_id' => 2, 'image_category' => 'frontView', 'image_url' => '/vehicles/honda_civic_2022_1772179604641.png'],
            ['vehicle_id' => 3, 'image_category' => 'frontView', 'image_url' => '/vehicles/tesla_model_3_2024_1772179616628.png'],
            ['vehicle_id' => 4, 'image_category' => 'frontView', 'image_url' => '/vehicles/ford_f150_2023_1772179642523.png'],
            ['vehicle_id' => 5, 'image_category' => 'frontView', 'image_url' => '/vehicles/bmw_3series_2021_1772179659205.png'],
            ['vehicle_id' => 6, 'image_category' => 'frontView', 'image_url' => '/vehicles/audi_a4_2022_1772179673335.png'],
            ['vehicle_id' => 7, 'image_category' => 'frontView', 'image_url' => '/vehicles/mercedes_cclass_2023_1772179698181.png'],
            ['vehicle_id' => 8, 'image_category' => 'frontView', 'image_url' => '/vehicles/chevrolet_silverado_2022_1772179712887.png']
        ]);
    }
}
